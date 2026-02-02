'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Types
export interface HealthReport {
    id: string;
    team_id: string;
    file_name: string;
    file_path: string;
    summary: string;
    created_at: string;
}

// Get archived reports for a team
export async function getTeamHealthReports(teamId: string) {
    const supabase = await createClient();

    const { data: reports, error } = await supabase
        .from('team_health_reports')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching health reports:', error);
        return { reports: null, error: error.message };
    }

    return { reports, error: null };
}

// Save health report metadata after PDF generation
export async function saveHealthReportMetadata(
    teamId: string,
    filePath: string,
    fileName: string,
    summary: string
) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    const { data: report, error } = await supabase
        .from('team_health_reports')
        .insert({
            team_id: teamId,
            file_path: filePath,
            file_name: fileName,
            summary: summary,
            created_by: user?.id,
        })
        .select()
        .single();

    if (error) {
        console.error('Error saving report metadata:', error);
        return { report: null, error: error.message };
    }

    revalidatePath(`/dashboard/teams/${teamId}`);
    revalidatePath('/dashboard');
    return { report, error: null };
}

// Get signed URL for downloading a report
export async function getReportDownloadUrl(filePath: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.storage
        .from('health-reports')
        .createSignedUrl(filePath, 60); // 60 seconds expiry

    if (error) {
        console.error('Error getting download URL:', error);
        return { url: null, error: error.message };
    }

    return { url: data.signedUrl, error: null };
}

// Upload health report PDF to storage
export async function uploadHealthReportPdf(
    teamId: string,
    fileName: string,
    pdfBlob: Blob
) {
    const supabase = await createClient();

    const { data, error } = await supabase.storage
        .from('health-reports')
        .upload(`${teamId}/${fileName}`, pdfBlob);

    if (error) {
        console.error('Error uploading PDF:', error);
        return { path: null, error: error.message };
    }

    return { path: data.path, error: null };
}

// Delete a health report
export async function deleteHealthReport(reportId: string, filePath: string) {
    const supabase = await createClient();

    // Delete from storage
    const { error: storageError } = await supabase.storage
        .from('health-reports')
        .remove([filePath]);

    if (storageError) {
        console.error('Error deleting file from storage:', storageError);
    }

    // Delete metadata
    const { error } = await supabase
        .from('team_health_reports')
        .delete()
        .eq('id', reportId);

    if (error) {
        console.error('Error deleting report metadata:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true, error: null };
}

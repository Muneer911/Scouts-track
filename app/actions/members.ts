'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Types
export interface MemberFormData {
    full_name: string;
    date_of_birth?: string | null;
    gender?: string | null;
    nationality?: string | null;
    parent_name?: string | null;
    parent_phone?: string | null;
    parent_email?: string | null;
    emergency_contact?: string | null;
    emergency_phone?: string | null;
    address?: string | null;
    notes?: string | null;
}

export interface MedicalFormData {
    blood_type?: string | null;
    allergies?: string | null;
    medications?: string | null;
    medical_conditions?: string | null;
    insurance_provider?: string | null;
    insurance_number?: string | null;
    doctor_name?: string | null;
    doctor_phone?: string | null;
}

export interface TeamMember {
    id: string;
    full_name: string;
    date_of_birth: string | null;
    gender: string | null;
    nationality: string | null;
    parent_name: string | null;
    parent_phone: string | null;
    parent_email: string | null;
    emergency_contact: string | null;
    emergency_phone: string | null;
    address: string | null;
    notes: string | null;
    doctor_name?: string | null;
    doctor_phone?: string | null;
    blood_type?: string | null;
    allergies?: string | null;
    medical_conditions?: string | null;
}

// Get single member with medical data
export async function getMemberById(memberId: string) {
    const supabase = await createClient();

    const { data: member, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', memberId)
        .single();

    if (error) {
        console.error('Error fetching member:', error);
        return { member: null, error: error.message };
    }

    return { member, error: null };
}

// Get members by team
export async function getMembersByTeam(teamId: string) {
    const supabase = await createClient();

    const { data: members, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId)
        .order('full_name');

    if (error) {
        console.error('Error fetching members:', error);
        return { members: null, error: error.message };
    }

    return { members, error: null };
}

// Create new member with optional medical record
export async function createMember(
    teamId: string,
    memberData: MemberFormData,
    medicalData?: MedicalFormData
) {
    const supabase = await createClient();

    // Insert team member
    const { data: member, error: memberError } = await supabase
        .from('team_members')
        .insert({
            team_id: teamId,
            ...memberData,
        })
        .select()
        .single();

    if (memberError) {
        console.error('Error creating member:', memberError);
        return { member: null, error: memberError.message };
    }

    // Insert medical record if provided
    if (medicalData && Object.values(medicalData).some(v => v)) {
        const { error: medicalError } = await supabase
            .from('medical_records')
            .insert({
                member_id: member.id,
                ...medicalData,
            });

        if (medicalError) {
            console.error('Error creating medical record:', medicalError);
            // Don't fail the whole operation, just log
        }
    }

    revalidatePath(`/dashboard/teams/${teamId}`);
    return { member, error: null };
}

// Update member
export async function updateMember(
    memberId: string,
    data: Partial<MemberFormData>
) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('team_members')
        .update({
            ...data,
            updated_at: new Date().toISOString(),
        })
        .eq('id', memberId);

    if (error) {
        console.error('Error updating member:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/teams');
    return { success: true, error: null };
}

// Delete member
export async function deleteMember(memberId: string, teamId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);

    if (error) {
        console.error('Error deleting member:', error);
        return { success: false, error: error.message };
    }

    revalidatePath(`/dashboard/teams/${teamId}`);
    return { success: true, error: null };
}

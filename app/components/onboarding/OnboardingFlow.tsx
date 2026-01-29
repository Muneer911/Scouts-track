"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, ChevronLeft, User, Building2, Users, Briefcase } from "lucide-react"
import { useTranslation } from "@/app/hooks/useTranslation"
import { saveOnboardingDataAction } from "@/app/actions/onboarding"

export function OnboardingFlow() {
  const { t } = useTranslation()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({
    name: "",
    role: "",
    organizationName: "",
    organizationType: "",
    teamSize: "",
  })

  const questions = [
    {
      id: "name",
      title: t('onboarding.name.title'),
      subtitle: t('onboarding.name.subtitle'),
      icon: User,
      type: "input" as const,
      placeholder: t('onboarding.name.placeholder'),
    },
    {
      id: "role",
      title: t('onboarding.role.title'),
      subtitle: t('onboarding.role.subtitle'),
      icon: Briefcase,
      type: "radio" as const,
      options: [
        { value: "manager", label: t('onboarding.role.options.manager') },
        { value: "leader", label: t('onboarding.role.options.leader') },
        { value: "member", label: t('onboarding.role.options.member') },
        { value: "executive", label: t('onboarding.role.options.executive') },
        { value: "other", label: t('onboarding.role.options.other') },
      ],
    },
    {
      id: "organizationName",
      title: t('onboarding.organization.title'),
      subtitle: t('onboarding.organization.subtitle'),
      icon: Building2,
      type: "input" as const,
      placeholder: t('onboarding.organization.placeholder'),
    },
    {
      id: "organizationType",
      title: t('onboarding.orgType.title'),
      subtitle: t('onboarding.orgType.subtitle'),
      icon: Building2,
      type: "radio" as const,
      options: [
        { value: "scouts", label: t('onboarding.orgType.options.scouts') },
        { value: "school", label: t('onboarding.orgType.options.school') },
        { value: "community", label: t('onboarding.orgType.options.community') },
        { value: "nonprofit", label: t('onboarding.orgType.options.nonprofit') },
        { value: "other", label: t('onboarding.orgType.options.other') },
      ],
    },
    {
      id: "teamSize",
      title: t('onboarding.teamSize.title'),
      subtitle: t('onboarding.teamSize.subtitle'),
      icon: Users,
      type: "radio" as const,
      options: [
        { value: "1-20", label: t('onboarding.teamSize.options.small') },
        { value: "21-50", label: t('onboarding.teamSize.options.medium') },
        { value: "51-100", label: t('onboarding.teamSize.options.large') },
        { value: "101-500", label: t('onboarding.teamSize.options.xlarge') },
        { value: "500+", label: t('onboarding.teamSize.options.enterprise') },
      ],
    },
  ]

  const progress = ((currentStep + 1) / questions.length) * 100
  const currentQuestion = questions[currentStep]
  const isLastStep = currentStep === questions.length - 1
  const canProceed = answers[currentQuestion.id]?.trim() !== ""

  const handleNext = async () => {
    if (isLastStep) {
      setIsSubmitting(true)
      try {
        // Save onboarding data to database
        await saveOnboardingDataAction({
          name: answers.name,
          role: answers.role,
          organizationName: answers.organizationName,
          organizationType: answers.organizationType,
          teamSize: answers.teamSize,
        })
        // Redirect to welcome page
        router.push('/welcome')
      } catch (error) {
        console.error('Error saving onboarding data:', error)
        setIsSubmitting(false)
      }
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleInputChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
  }

  const Icon = currentQuestion.icon

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {t('onboarding.step')} {currentStep + 1} {t('onboarding.of')} {questions.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}% {t('onboarding.complete')}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-2 text-balance">
              {currentQuestion.title}
            </h1>
            <p className="text-muted-foreground">{currentQuestion.subtitle}</p>
          </div>

          <div className="space-y-6">
            {currentQuestion.type === "input" && (
              <div className="space-y-2">
                <Input
                  id={currentQuestion.id}
                  type="text"
                  placeholder={currentQuestion.placeholder}
                  value={answers[currentQuestion.id]}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="h-12 text-base bg-card"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canProceed) {
                      handleNext()
                    }
                  }}
                />
              </div>
            )}

            {currentQuestion.type === "radio" && currentQuestion.options && (
              <RadioGroup
                value={answers[currentQuestion.id]}
                onValueChange={handleInputChange}
                className="space-y-3"
              >
                {currentQuestion.options.map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={option.value}
                    className="flex items-center space-x-3 space-x-reverse p-4 rounded-lg border border-border bg-card cursor-pointer hover:bg-accent/50 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <span className="text-foreground">{option.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              {t('onboarding.back')}
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed || isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? t('common.actions.saving') : (isLastStep ? t('onboarding.getStarted') : t('onboarding.continue'))}
              {!isSubmitting && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export type Organization = {
  id: string
  name: string
  accent_color: string
  plan: 'free' | 'pro'
  subscription_status: 'trial' | 'active' | 'past_due' | 'canceled'
  trial_ends_at: string | null
}

type OrgContextType = {
  org: Organization | null
  setOrg: (org: Organization | null) => void
  updateOrgName: (name: string) => void
  updateAccentColor: (color: string) => void
}

const OrgContext = createContext<OrgContextType | undefined>(undefined)

export const OrgProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [org, setOrg] = useState<Organization | null>(null)

  const updateOrgName = (name: string) => {
    setOrg((prev) => (prev ? { ...prev, name } : null))
  }

  const updateAccentColor = (color: string) => {
    setOrg((prev) => (prev ? { ...prev, accent_color: color } : null))
  }

  return (
    <OrgContext.Provider value={{ org, setOrg, updateOrgName, updateAccentColor }}>
      {children}
    </OrgContext.Provider>
  )
}

export const useOrg = () => {
  const context = useContext(OrgContext)
  if (!context) {
    throw new Error('useOrg must be used within OrgProvider')
  }
  return context
}

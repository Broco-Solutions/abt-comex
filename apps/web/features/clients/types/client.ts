export type DemonstrationClient = {
  id: string
  name: string
  contacts: { id: string; label: string }[]
  source: "Fixture sintético local"
  updatedOn: string
  country?: string
  taxReference?: string
  roles?: { role: string; active: boolean }[]
}

import itheimaApi from './itheima-api'

export interface LocationInfo {
  code: string
  name: string
  fullName: string
  level: 'province' | 'city' | 'area'
}

async function searchProvinces(keyword: string): Promise<LocationInfo[]> {
  const provinces = await getProvinces()
  return provinces
    .filter((p) => p.includes(keyword))
    .map((p) => ({ code: '', name: p, fullName: p, level: 'province' as const }))
}

async function searchCities(keyword: string): Promise<LocationInfo[]> {
  const provinces = await getProvinces()
  const results: LocationInfo[] = []

  for (const pname of provinces) {
    try {
      const cities = await getCities(pname)
      for (const cname of cities) {
        if (cname.includes(keyword)) {
          results.push({
            code: '',
            name: cname,
            fullName: `${pname} - ${cname}`,
            level: 'city' as const,
          })
        }
      }
    } catch {
      continue
    }
  }
  return results
}

async function searchAreas(keyword: string): Promise<LocationInfo[]> {
  const provinces = await getProvinces()
  const results: LocationInfo[] = []

  for (const pname of provinces) {
    try {
      const cities = await getCities(pname)
      for (const cname of cities) {
        try {
          const areas = await getAreas(pname, cname)
          for (const aname of areas) {
            if (aname.includes(keyword)) {
              results.push({
                code: '',
                name: aname,
                fullName: `${pname} - ${cname} - ${aname}`,
                level: 'area' as const,
              })
            }
          }
        } catch {
          continue
        }
      }
    } catch {
      continue
    }
  }
  return results
}

export async function searchLocation(keyword: string): Promise<LocationInfo[]> {
  if (!keyword.trim()) return []

  const [provinces, cities, areas] = await Promise.all([
    searchProvinces(keyword),
    searchCities(keyword),
    searchAreas(keyword),
  ])

  return [...provinces, ...cities, ...areas].slice(0, 20)
}

export async function getProvinces(): Promise<string[]> {
  const result = (await itheimaApi.get('/api/province')) as any
  return result.list || []
}

export async function getCities(pname: string): Promise<string[]> {
  const result = (await itheimaApi.get('/api/city', {
    params: { pname },
  })) as any
  return result.list || []
}

export async function getAreas(pname: string, cname: string): Promise<string[]> {
  const result = (await itheimaApi.get('/api/area', {
    params: { pname, cname },
  })) as any
  return result.list || []
}

"use client"

import { useState, useEffect, useMemo } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Download, Save } from "lucide-react"
import Image from "next/image"

interface Reporte {
  id: string
  direccionTerritorial: string
  tipoTramite: string
  xDT: number
  u: number
  t: number
  td?: number // Solo para terreno
  T: number
  Tr: number
  costoTotal: number
  fecha: string
  // Campos adicionales para terreno
  rint?: number
  rjun?: number
  digit?: number
  coorof?: number
  coorter?: number
  alpha?: number
  nc?: number
  zof?: number
  zter?: number
}

export default function Component() {
  // Opciones para las listas desplegables según especificaciones exactas
  const oficinaOptions = [
    "1 | OFICINA | Complementacion (Modificacion/Rectificacion) | Dato a complementar de un FMI | medio-bajo",
    "1 | OFICINA | Complementacion (Modificacion/Rectificacion) | Dato a complementar por CC | bajo",
    "1 | OFICINA | Complementacion (Modificacion/Rectificacion) | Dato a complementar por nomenclatura | bajo",
    "1 | OFICINA | Complementacion (Modificacion/Rectificacion) | Dato a complementar por sexo | bajo",
    "1 | OFICINA | Mutacion Primera | Venta por % (Derechos de cuota) | medio",
    "1 | OFICINA | Mutacion Primera | Transferencia directa | bajo",
    "1 | OFICINA | Mutacion Primera | Transferencia informalidades | medio-alto",
    "1 | OFICINA | Rectificacion O | Rectificacion (Predio) | medio-alto",
    "1 | OFICINA | Rectificacion O | Rectificacion (Propietario) | bajo",
    "1 | OFICINA | Rectificacion O | Rectificacion (FMI) | medio-bajo",
    "1 | OFICINA | Rectificacion O | Rectificacion (Nomenclatura) | bajo",
    "1 | OFICINA | Cancelacion de Predio | Doble Inscripcion | medio-bajo",
    "1 | OFICINA | Cancelacion de Predio | Fuerza mayor (Formal/Informal) | medio",
    "1 | OFICINA | Cancelacion de Predio | Cancelacion x modificacion de perimetro U/Modificacion de Lim Municipal | alto",
    "1 | OFICINA | Cancelacion de Predio | Cancelacion de la mejora | medio-bajo",
    "1 | OFICINA | Cancelacion de Predio | Cancelacion por orden judicial | medio",
    "1 | OFICINA | Mutacion Segunda Coeficiente_Copropiedad | Reforma de reglamento de PH (sin Afectacion en Area de Terrreno) | medio-alto",
    "1 | OFICINA | Mutacion Segunda Coeficiente_Copropiedad | Reforma de reglamento de PH (con Afectacion en Area de Terrreno) | medio-alto",
    "1 | OFICINA | Mutacion Segunda Coeficiente_Copropiedad | Reforma de reglamento de PH (MIXTA Afectacion en Area de Terrreno) | alto",
    "1 | OFICINA | Mutacion Segunda Coeficiente_Copropiedad | Apertura de FMI de zonas comunes en PH | medio-alto",
    "2 | OFICINA | Mutacion Cuarta| Expedicion de acto administrativo (Autoestimacion) | medio-alto",
    "2 | OFICINA | Mutacion Cuarta| Expedicion de acto administrativo (Confirmacion de Avaluo) | medio-alto",
  ]

  const terrenoOptions = [
    "2 | TERRENO | Mutacion Tercera | Generacion de fichas matriz en condicion de PH o condominio | medio-bajo",
    "2 | TERRENO | Mutacion Tercera | Inscripcion alfanumerica y geografica | medio-bajo",
    "2 | TERRENO | Mutacion Tercera | Omisiones/Comisiones geograficas de la construccion | medio-bajo",
    "2 | TERRENO | Mutacion Tercera | Multiples unidades, construcciones convencionales y No convencionales | medio-alto",
    "2 | TERRENO | Mutacion Tercera | Incremento del area construida en informalidades | medio",
    "2 | TERRENO | Revision de Avaluo | Modificacion de zonas | alto",
    "2 | TERRENO | Revision de Avaluo | Cobertura de zonas | alto",
    "2 | TERRENO | Revision de Avaluo | Incongruencia de informacion (Zonas, tablas) | medio-alto",
    "2 | TERRENO | Revision de Avaluo | Diferencias en area de terreno | medio-alto",
    "2 | TERRENO | Revision de Avaluo | Diferencias en area construida | medio",
    "3 | TERRENO | Mutacion Quinta Nuevo | Falsas Tradiciones | medio-alto",
    "3 | TERRENO | Mutacion Quinta Nuevo | Incorporacion de la informalidad | medio-alto",
    "3 | TERRENO | Mutacion Quinta Nuevo | Incorporacion de predios nuevos formales | medio-alto",
    "3 | TERRENO | Mutacion Segunda Desenglobe | PH 1-50 (Homogeneos) | medio-bajo",
    "3 | TERRENO | Mutacion Segunda Desenglobe | PH 1-50 (Heterogeneos) | medio",
    "3 | TERRENO | Mutacion Segunda Desenglobe | PH 51-200 (Homogeneos) | medio-bajo",
    "3 | TERRENO | Mutacion Segunda Desenglobe | PH 51-200 (Heterogeneos) | medio",
    "3 | TERRENO | Mutacion Segunda Desenglobe | PH >200 (Homogeneos) | medio-bajo",
    "3 | TERRENO | Mutacion Segunda Desenglobe | PH >200 (Heterogeneos) | medio",
    "3 | TERRENO | Mutacion Segunda Desenglobe | NPH 1-50 (Homogeneos) | medio-bajo",
    "3 | TERRENO | Mutacion Segunda Desenglobe | NPH 1-50 (Heterogeneos) | medio",
    "3 | TERRENO | Mutacion Segunda Desenglobe | NPH 51-200 (Homogeneos) | medio-bajo",
    "3 | TERRENO | Mutacion Segunda Desenglobe | NPH 51-200 (Heterogeneos) | medio",
    "3 | TERRENO | Mutacion Segunda Desenglobe | NPH >200 (Homogeneos) | medio-bajo",
    "3 | TERRENO | Mutacion Segunda Desenglobe | NPH >200 (Heterogeneos) | medio",
    "3 | TERRENO | Mutacion Segunda Desenglobe | Incorporacion de PH sobre predios autoestimados | medio-alto",
    "3 | TERRENO | Mutacion Segunda Desenglobe | Desenglobe Limites Municipales / Perimetros | medio-alto",
    "3 | TERRENO | Rectificacion T | Rectificacion (Construccion) | medio",
    "3 | TERRENO | Rectificacion T | Rectificacion (Anio) | bajo",
    "3 | TERRENO | Rectificacion T | Rectificacion (Terreno con fin catatral) | alto",
    "3 | TERRENO | Rectificacion T | Rectificacion (Terreno con origen en Registro) | alto",
    "3 | TERRENO | Mutacion Quinta Omitido | Ajuste de predios omitidos | medio-alto",
    "3 | TERRENO | Mutacion Quinta Omitido | Reactivacion de ficha | medio-alto",
    "3 | TERRENO | Mutacion Quinta Omitido | Incorporacion de predios por omisiones en otros procesos catastrales | medio-alto",
    "3 | TERRENO | Mutacion Segunda Englobe | Predios No continuos | medio-bajo",
    "3 | TERRENO | Mutacion Segunda Englobe | Englobe Predio Mejora | medio-alto",
    "3 | TERRENO | Mutacion Segunda Englobe | Englobe sobre Limites Municipales / Perimetros | medio",
    "3 | TERRENO | Mutacion Segunda Englobe | Englobe sobre Predio Urbanos | medio-bajo",
    "3 | TERRENO | Mutacion Segunda Englobe | Englobe sobre Predio Rurales | medio-bajo",
    "4 | TERRENO | Modificacion Inscripcion Catastral | Cambio de perimetro Urbano/Rural | medio-alto",
    "4 | TERRENO | Modificacion Inscripcion Catastral | Cambio de perimetro Departamental | medio-alto",
    "4 | TERRENO | Modificacion Inscripcion Catastral | Cambio de perimetro Municipal | medio-alto",
    "4 | TERRENO | Modificacion Inscripcion Catastral | Cambio de perimetro Urbano/Rural (Limites claros de norma) | alto",
    "4 | TERRENO | Modificacion Inscripcion Catastral | Cambio de perimetro Departamental (Limites claros de norma) | alto",
    "4 | TERRENO | Modificacion Inscripcion Catastral | Cambio de perimetro Municipal (Limites claros de norma) | alto",
  ]

  const direccionTerritorialOptions = [
    "ATLANTICO",
    "BOLIVAR",
    "BOYACA",
    "CALDAS",
    "CAQUETA",
    "CASANARE",
    "CAUCA",
    "CESAR",
    "CORDOBA",
    "CUNDINAMARCA",
    "GUAJIRA",
    "HUILA",
    "MAGDALENA",
    "META",
    "NARIÑO",
    "NORTE DE SANTANDER",
    "QUINDIO",
    "RISARALDA",
    "SANTANDER",
    "SUCRE",
    "TOLIMA",
    "VALLE",
  ]

  // Estados para Modelo Oficina
  const [oficinaParams, setOficinaParams] = useState({
    direccionTerritorial: "default",
    tipoTramite: "default",
    xDT: 6,
    u: 600,
    t: 1,
    dhr: 15,
    dhn: 15,
    alpha: 0,
    nc: 0,
    T: 0,
    Tr: 0,
    cprom: 4200000,
    cpromcoorof: 4725000,
    Pr: 0,
  })

  // Estados para Modelo Terreno
  const [terrenoParams, setTerrenoParams] = useState({
    direccionTerritorial: "default",
    tipoTramite: "default",
    rint: 2,
    rjun: 3,
    u: 60,
    t: 1,
    td: 0,
    tmax: 8,
    dhr: 30,
    dhn: 30,
    alpha: 0,
    nc: 0,
    T: 0,
    Tr: 0,
    cpromrint: 4200000,
    cpromrjun: 3570000,
    cpromrdigit: 3400000,
    cpromcoorter: 4725000,
    Pr: 0,
  })

  // Estados para reportes
  const [reportesOficina, setReportesOficina] = useState<Reporte[]>([])
  const [reportesTerreno, setReportesTerreno] = useState<Reporte[]>([])

  // Estados para valores guardados
  const [CTOficinaGuardado, setCTOficinaGuardado] = useState<number>(0)
  const [CTTerrenoGuardado, setCTTerrenoGuardado] = useState<number>(0)

  // Cálculos derivados para Oficina
  const coorof = Math.floor(oficinaParams.xDT / 5)

  // Cálculos derivados para Terreno
  const digit = Math.floor(terrenoParams.rjun / 3)
  const xDTTerreno = terrenoParams.rint + terrenoParams.rjun + digit
  const coorter = Math.floor(xDTTerreno / 5)

  // Efecto para actualizar T de oficina basado en Zof
  useEffect(() => {
    const p = (oficinaParams.dhr / oficinaParams.dhn) * (1 + oficinaParams.alpha * (oficinaParams.nc / 100))
    const Zof = oficinaParams.xDT * oficinaParams.u * oficinaParams.t * (1 / p)

    setOficinaParams((prev) => ({
      ...prev,
      T: Math.round(Zof),
    }))
  }, [
    oficinaParams.xDT,
    oficinaParams.u,
    oficinaParams.t,
    oficinaParams.dhr,
    oficinaParams.dhn,
    oficinaParams.alpha,
    oficinaParams.nc,
  ])

  // Efecto para actualizar T de terreno basado en Zter
  useEffect(() => {
    const tdAjustado = terrenoParams.td * 0.00136986
    const p = (terrenoParams.dhr / terrenoParams.dhn) * (1 + terrenoParams.alpha * (terrenoParams.nc / 100))
    const Zter =
      xDTTerreno * terrenoParams.u * (terrenoParams.t * (1 - tdAjustado / (terrenoParams.tmax * 0.00136986))) * (1 / p)

    setTerrenoParams((prev) => ({
      ...prev,
      T: Math.round(Zter),
    }))
  }, [
    xDTTerreno,
    terrenoParams.u,
    terrenoParams.t,
    terrenoParams.td,
    terrenoParams.tmax,
    terrenoParams.dhr,
    terrenoParams.dhn,
    terrenoParams.alpha,
    terrenoParams.nc,
  ])

  // Cálculos para Modelo Oficina
  const calcularOficina = () => {
    const p = (oficinaParams.dhr / oficinaParams.dhn) * (1 + oficinaParams.alpha * (oficinaParams.nc / 100))
    const Zof = oficinaParams.xDT * oficinaParams.u * oficinaParams.t * (1 / p)
    const B = (oficinaParams.T + oficinaParams.xDT + oficinaParams.Tr) / Zof
    const C =
      oficinaParams.cprom * oficinaParams.xDT * oficinaParams.t + oficinaParams.cpromcoorof * coorof * oficinaParams.t
    return { p, Zof, B, C }
  }

  // Cálculos para Modelo Terreno
  const calcularTerreno = () => {
    const tdAjustado = terrenoParams.td * 0.00136986
    const p = (terrenoParams.dhr / terrenoParams.dhn) * (1 + terrenoParams.alpha * (terrenoParams.nc / 100))
    const Zter =
      xDTTerreno * terrenoParams.u * (terrenoParams.t * (1 - tdAjustado / (terrenoParams.tmax * 0.00136986))) * (1 / p)
    const B = (terrenoParams.T + xDTTerreno + terrenoParams.Tr) / Zter
    const C =
      (terrenoParams.cpromrint * terrenoParams.rint +
        terrenoParams.cpromrjun * terrenoParams.rjun +
        terrenoParams.cpromrdigit * digit +
        coorter * terrenoParams.cpromcoorter) *
      terrenoParams.t
    return { p, Zter, B, C }
  }

  const resultadosOficina = calcularOficina()
  const resultadosTerreno = calcularTerreno()

  // Funciones CRUD para reportes
  const incluirReporteOficina = () => {
    const nuevoReporte: Reporte = {
      id: `oficina-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      direccionTerritorial: oficinaParams.direccionTerritorial,
      tipoTramite: oficinaParams.tipoTramite,
      xDT: oficinaParams.xDT,
      u: oficinaParams.u,
      t: oficinaParams.t,
      T: oficinaParams.T,
      Tr: oficinaParams.Tr,
      costoTotal: resultadosOficina.C,
      fecha: new Date().toLocaleDateString(),
      coorof: coorof,
      alpha: oficinaParams.alpha,
      nc: oficinaParams.nc,
      zof: resultadosOficina.Zof,
    }
    setReportesOficina((prev) => [...prev, nuevoReporte])
  }

  const incluirReporteTerreno = () => {
    const nuevoReporte: Reporte = {
      id: `terreno-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      direccionTerritorial: terrenoParams.direccionTerritorial,
      tipoTramite: terrenoParams.tipoTramite,
      xDT: xDTTerreno,
      u: terrenoParams.u,
      t: terrenoParams.t,
      td: terrenoParams.td,
      T: terrenoParams.T,
      Tr: terrenoParams.Tr,
      costoTotal: resultadosTerreno.C,
      fecha: new Date().toLocaleDateString(),
      rint: terrenoParams.rint,
      rjun: terrenoParams.rjun,
      digit: digit,
      coorter: coorter,
      alpha: terrenoParams.alpha,
      nc: terrenoParams.nc,
      zter: resultadosTerreno.Zter,
    }
    setReportesTerreno((prev) => [...prev, nuevoReporte])
  }

  const eliminarReporteOficina = (id: string) => {
    setReportesOficina((prev) => prev.filter((reporte) => reporte.id !== id))
  }

  const eliminarReporteTerreno = (id: string) => {
    setReportesTerreno((prev) => prev.filter((reporte) => reporte.id !== id))
  }

  const formatValue = (value: any) => {
    if (value === "default") return "N/A"
    return value
  }

  const exportarReportes = (tipo: string) => {
    const reportes = tipo === "oficina" ? reportesOficina : reportesTerreno

    const headers = [
      "DT",
      "Tipo Tramite",
      "Personal Total",
      "Coordinador",
      "Reconocedor Integral",
      "Reconocedor Junior",
      "Digitalizador",
      "Tasa",
      "Tiempo",
      "Complejidad",
      "Nivel",
      "Desplazamiento",
      "Capacidad Oficina (Zof)",
      "Capacidad Terreno (Zter)",
      "Costo Total",
    ]

    const rows = reportes.map((r) => [
      formatValue(r.direccionTerritorial),
      formatValue(r.tipoTramite),
      r.xDT,
      tipo === "oficina" ? r.coorof || 0 : r.coorter || 0,
      r.rint || 0,
      r.rjun || 0,
      r.digit || 0,
      r.u,
      r.t,
      r.alpha || 0,
      r.nc || 0,
      r.td || 0,
      r.zof || 0,
      r.zter || 0,
      r.costoTotal,
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `reportes_${tipo}_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportarReporteGeneral = () => {
    const todosReportes = [...reportesOficina, ...reportesTerreno]

    const headers = [
      "DT",
      "Tipo Tramite",
      "Personal Total",
      "Coordinador",
      "Reconocedor Integral",
      "Reconocedor Junior",
      "Digitalizador",
      "Tasa",
      "Tiempo",
      "Complejidad",
      "Nivel",
      "Desplazamiento",
      "Capacidad Oficina (Zof)",
      "Capacidad Terreno (Zter)",
      "Costo Total",
    ]

    const rows = todosReportes.map((r) => [
      formatValue(r.direccionTerritorial),
      formatValue(r.tipoTramite),
      r.xDT,
      r.coorof || r.coorter || 0,
      r.rint || 0,
      r.rjun || 0,
      r.digit || 0,
      r.u,
      r.t,
      r.alpha || 0,
      r.nc || 0,
      r.td || 0,
      r.zof || 0,
      r.zter || 0,
      r.costoTotal,
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `reporte_general_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Cálculos de totales usando useMemo para optimización
  const CTOficina = useMemo(() => {
    return reportesOficina.reduce((sum, reporte) => sum + reporte.costoTotal, 0)
  }, [reportesOficina])

  const CTTerreno = useMemo(() => {
    return reportesTerreno.reduce((sum, reporte) => sum + reporte.costoTotal, 0)
  }, [reportesTerreno])

  // Funciones para guardar valores
  const guardarCTOficina = () => {
    setCTOficinaGuardado(CTOficina)
  }

  const guardarCTTerreno = () => {
    setCTTerrenoGuardado(CTTerreno)
  }

  // Mensajes de optimización
  const mensajeOptimizacionOficina = useMemo(() => {
    return oficinaParams.Pr > CTOficina
      ? "Puede adicionar tramites a la DT para la vigencia"
      : "Debe reducir tramites a la DT para la vigencia"
  }, [oficinaParams.Pr, CTOficina])

  const mensajeOptimizacionTerreno = useMemo(() => {
    return terrenoParams.Pr > CTTerreno
      ? "Puede adicionar tramites a la DT para la vigencia"
      : "Debe reducir tramites a la DT para la vigencia"
  }, [terrenoParams.Pr, CTTerreno])

  const alphaOptions = [
    { value: 0, label: "0.0 (Sin seleccion especifica)" },
    { value: 0.2, label: "0.2 (Bajo)" },
    { value: 0.4, label: "0.4 (Medio-bajo)" },
    { value: 0.6, label: "0.6 (Medio)" },
    { value: 0.8, label: "0.8 (Medio-alto)" },
    { value: 1, label: "1 (Alto)" },
  ]

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8 flex items-center justify-center gap-4">
        <div className="flex-shrink-0">
          <Image src="/logo-igac.png" alt="Logo IGAC" width={80} height={100} />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Simulador de Tramites Catastrales</h1>
          <p className="text-muted-foreground">
            Simula la cantidad de tramites pendientes segun modelos matematicos de Oficina y Terreno
          </p>
        </div>
      </div>

      <Tabs defaultValue="oficina" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="oficina" className="flex items-center gap-2">
            <Image src="/logo-igac.png" alt="Logo IGAC" width={24} height={30} />
            <span>Modelo Oficina</span>
          </TabsTrigger>
          <TabsTrigger value="terreno" className="flex items-center gap-2">
            <Image src="/logo-igac.png" alt="Logo IGAC" width={24} height={30} />
            <span>Modelo Terreno</span>
          </TabsTrigger>
          <TabsTrigger value="resumen" className="flex items-center gap-2">
            <Image src="/logo-igac.png" alt="Logo IGAC" width={24} height={30} />
            <span>Resumen General</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="oficina" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Modelo Oficina - Parametros Basicos</CardTitle>
              <CardDescription>Ajusta los parametros para el modelo de oficina de tramites catastrales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Lista desplegable de dirección territorial */}
              <div className="space-y-2">
                <Label>Direccion Territorial</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Seleccione la Direccion Terrorial a analizar, sino deje por defecto en vacio la lista
                </p>
                <Select
                  value={oficinaParams.direccionTerritorial}
                  onValueChange={(value) => setOficinaParams((prev) => ({ ...prev, direccionTerritorial: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una direccion territorial (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Sin seleccion especifica</SelectItem>
                    {direccionTerritorialOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Lista desplegable de tipo de trámite */}
              <div className="space-y-2">
                <Label>Tipo de Tramite Catastral</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Seleccione el tipo de tramite catastral a analizar puntualmente, sino deje por defecto en vacio la
                  lista
                </p>
                <Select
                  value={oficinaParams.tipoTramite}
                  onValueChange={(value) => setOficinaParams((prev) => ({ ...prev, tipoTramite: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un tipo de tramite (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Sin seleccion especifica</SelectItem>
                    {oficinaOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Cantidad de personal asignado OFICINA (xDT): {oficinaParams.xDT}</Label>
                  <Slider
                    value={[oficinaParams.xDT]}
                    onValueChange={(value) => setOficinaParams((prev) => ({ ...prev, xDT: value[0] }))}
                    min={1}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tasa de resolucion por persona/mes (u): {oficinaParams.u}</Label>
                  <Slider
                    value={[oficinaParams.u]}
                    onValueChange={(value) => setOficinaParams((prev) => ({ ...prev, u: value[0] }))}
                    min={50}
                    max={800}
                    step={10}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tiempo estimado resolucion (t): {oficinaParams.t} meses</Label>
                  <Slider
                    value={[oficinaParams.t]}
                    onValueChange={(value) => setOficinaParams((prev) => ({ ...prev, t: value[0] }))}
                    min={1}
                    max={12}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Dias Habiles Transcurridos del requerimiento n (dhr): {oficinaParams.dhr}</Label>
                  <Slider
                    value={[oficinaParams.dhr]}
                    onValueChange={(value) => setOficinaParams((prev) => ({ ...prev, dhr: value[0] }))}
                    min={0}
                    max={180}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Dias Habiles Necesarios Legales del requerimiento n (dhn): {oficinaParams.dhn}</Label>
                  <Slider
                    value={[oficinaParams.dhn]}
                    onValueChange={(value) => setOficinaParams((prev) => ({ ...prev, dhn: value[0] }))}
                    min={0}
                    max={180}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Factor de complejidad (alpha)</Label>
                  <Select
                    value={oficinaParams.alpha.toString()}
                    onValueChange={(value) =>
                      setOficinaParams((prev) => ({ ...prev, alpha: Number.parseFloat(value) }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {alphaOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Nivel de complejidad de los tramites (nc): {oficinaParams.nc}%</Label>
                  <Slider
                    value={[oficinaParams.nc]}
                    onValueChange={(value) => setOficinaParams((prev) => ({ ...prev, nc: value[0] }))}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
              
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Cantidad de Coordinador(es) OFICINA: {coorof}</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      Calculado automaticamente: 1 coordinador por cada 5 ejecutores
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Factor p calculado</h4>
                  <p className="text-2xl font-bold text-blue-600">{resultadosOficina.p.toFixed(4)}</p>
                </Card>
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Capacidad Oficina (Zof)</h4>
                  <p className="text-2xl font-bold text-green-600">{resultadosOficina.Zof.toFixed(2)}</p>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cargas - Oficina</CardTitle>
              <CardDescription>Configuracion de cargas de trabajo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Cantidad de tramites pendientes de OFICINA de periodo(s) a proyectar (T)</Label>
                <Input
                  type="number"
                  value={oficinaParams.T}
                  onChange={(e) => setOficinaParams((prev) => ({ ...prev, T: Number.parseInt(e.target.value) || 0 }))}
                  min={5}
                  max={10000}
                />
              </div>
              <div className="space-y-2">
                <Label>Cantidad de tramites pendientes de OFICINA de periodo(s) pasado(s) (Tr)</Label>
                <Input
                  type="number"
                  value={oficinaParams.Tr}
                  onChange={(e) => setOficinaParams((prev) => ({ ...prev, Tr: Number.parseInt(e.target.value) || 0 }))}
                  min={0}
                  max={500000}
                />
              </div>
              <Card className="p-4">
                <h4 className="font-semibold mb-2">Carga Total (B)</h4>
                <p className="text-2xl font-bold text-orange-600">{resultadosOficina.B.toFixed(2)}</p>
              </Card>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Costos - Oficina</CardTitle>
              <CardDescription>Configuracion de costos operativos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Costo Promedio por ejecutor OFICINA</Label>
                <Input
                  type="number"
                  value={oficinaParams.cprom}
                  onChange={(e) =>
                    setOficinaParams((prev) => ({ ...prev, cprom: Number.parseInt(e.target.value) || 0 }))
                  }
                  min={2000000}
                  max={20000000}
                />
              </div>
              <div className="space-y-2">
                <Label>Costo Promedio por coordinador de OFICINA</Label>
                <Input
                  type="number"
                  value={oficinaParams.cpromcoorof}
                  onChange={(e) =>
                    setOficinaParams((prev) => ({ ...prev, cpromcoorof: Number.parseInt(e.target.value) || 0 }))
                  }
                  min={2000000}
                  max={20000000}
                />
              </div>
              <Card className="p-4">
                <h4 className="font-semibold mb-2">Costo Total (C)</h4>
                <p className="text-2xl font-bold text-red-600">${resultadosOficina.C.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Costo por {oficinaParams.xDT} ejecutores y {coorof} coordinadores durante {oficinaParams.t}{" "}
                  {oficinaParams.t === 1 ? "mes" : "meses"}
                </p>
              </Card>
            </CardContent>
          </Card>

          {/* PARTE 4 - Reporte de Optimización */}
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Optimizacion por tramite catastral para la Ejecucion de DTS</CardTitle>
              <CardDescription>Sistema de gestion de reportes para optimizacion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 mb-4">
                <Button onClick={incluirReporteOficina} className="bg-green-600 hover:bg-green-700">
                  Incluir reporte
                </Button>
                <Button
                  onClick={() => exportarReportes("oficina")}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={reportesOficina.length === 0}
                >
                  <Download className="h-4 w-4" />
                  Exportar Reportes ({reportesOficina.length})
                </Button>
              </div>

              {reportesOficina.length > 0 && (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>DT</TableHead>
                          <TableHead>Tipo Tramite</TableHead>
                          <TableHead>Personal Total</TableHead>
                          <TableHead>Coordinador</TableHead>
                          <TableHead>Reconocedor Integral</TableHead>
                          <TableHead>Reconocedor Junior</TableHead>
                          <TableHead>Digitalizador</TableHead>
                          <TableHead>Tasa</TableHead>
                          <TableHead>Tiempo</TableHead>
                          <TableHead>Complejidad</TableHead>
                          <TableHead>Nivel</TableHead>
                          <TableHead>Desplazamiento</TableHead>
                          <TableHead>Capacidad Oficina (Zof)</TableHead>
                          <TableHead>Capacidad Terreno (Zter)</TableHead>
                          <TableHead>Costo Total</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportesOficina.map((reporte) => (
                          <TableRow key={reporte.id}>
                            <TableCell>{formatValue(reporte.direccionTerritorial)}</TableCell>
                            <TableCell className="max-w-xs truncate">{formatValue(reporte.tipoTramite)}</TableCell>
                            <TableCell>{reporte.xDT}</TableCell>
                            <TableCell>{reporte.coorof || 0}</TableCell>
                            <TableCell>0</TableCell>
                            <TableCell>0</TableCell>
                            <TableCell>0</TableCell>
                            <TableCell>{reporte.u}</TableCell>
                            <TableCell>{reporte.t}</TableCell>
                            <TableCell>{reporte.alpha || 0}</TableCell>
                            <TableCell>{reporte.nc || 0}</TableCell>
                            <TableCell>0</TableCell>
                            <TableCell>{reporte.zof?.toFixed(2) || 0}</TableCell>
                            <TableCell>0</TableCell>
                            <TableCell>${reporte.costoTotal.toLocaleString()}</TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline" onClick={() => eliminarReporteOficina(reporte.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Contador Costo Total (CT)</h4>
                    <p className="text-2xl font-bold text-purple-600">${CTOficina.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Basado en {reportesOficina.length} reporte{reportesOficina.length !== 1 ? "s" : ""}
                    </p>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>

          {/* PARTE 5 - Resumen de Optimización */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Optimizacion para la Ejecucion de DTS</CardTitle>
              <CardDescription>Analisis comparativo de asignacion vs costos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Asignacion Conservacion Vigencia OFICINA en ejecucion (Pr)</Label>
                <Input
                  type="number"
                  value={oficinaParams.Pr}
                  onChange={(e) => setOficinaParams((prev) => ({ ...prev, Pr: Number.parseInt(e.target.value) || 0 }))}
                  min={0}
                  max={100000000000}
                />
              </div>

              <Card
                className={`p-4 ${oficinaParams.Pr > CTOficina ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
              >
                <h4 className="font-semibold mb-2">Mensaje de Optimizacion</h4>
                <p
                  className={`text-lg font-medium ${oficinaParams.Pr > CTOficina ? "text-green-700" : "text-red-700"}`}
                >
                  {mensajeOptimizacionOficina}
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Asignacion: ${oficinaParams.Pr.toLocaleString()}</p>
                  <p>Costo Total: ${CTOficina.toLocaleString()}</p>
                  <p>Diferencia: ${Math.abs(oficinaParams.Pr - CTOficina).toLocaleString()}</p>
                </div>
              </Card>
            </CardContent>
          </Card>

          {/* PARTE 6 - Guardar */}
          <Card>
            <CardHeader>
              <CardTitle>Guardar Resultados</CardTitle>
              <CardDescription>Guarda el valor del Contador Costo Total para el resumen general</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={guardarCTOficina} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Guardar CT Oficina (${CTOficina.toLocaleString()})
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terreno" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Modelo Terreno - Parametros Basicos</CardTitle>
              <CardDescription>Ajusta los parametros para el modelo de terreno de tramites catastrales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Lista desplegable de dirección territorial */}
              <div className="space-y-2">
                <Label>Direccion Territorial</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Seleccione la Direccion Terrorial a analizar, sino deje por defecto en vacio la lista
                </p>
                <Select
                  value={terrenoParams.direccionTerritorial}
                  onValueChange={(value) => setTerrenoParams((prev) => ({ ...prev, direccionTerritorial: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una direccion territorial (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Sin seleccion especifica</SelectItem>
                    {direccionTerritorialOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Lista desplegable de tipo de trámite */}
              <div className="space-y-2">
                <Label>Tipo de Tramite Catastral</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Seleccione el tipo de tramite catastral a analizar puntualmente, sino deje por defecto en vacio la
                  lista
                </p>
                <Select
                  value={terrenoParams.tipoTramite}
                  onValueChange={(value) => setTerrenoParams((prev) => ({ ...prev, tipoTramite: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un tipo de tramite (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Sin seleccion especifica</SelectItem>
                    {terrenoOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Reconocedor Integral (rint): {terrenoParams.rint}</Label>
                  <Slider
                    value={[terrenoParams.rint]}
                    onValueChange={(value) => setTerrenoParams((prev) => ({ ...prev, rint: value[0] }))}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Reconocedor Junior (rjun): {terrenoParams.rjun}</Label>
                  <Slider
                    value={[terrenoParams.rjun]}
                    onValueChange={(value) => setTerrenoParams((prev) => ({ ...prev, rjun: value[0] }))}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tasa de resolucion por persona/mes (u): {terrenoParams.u}</Label>
                  <Slider
                    value={[terrenoParams.u]}
                    onValueChange={(value) => setTerrenoParams((prev) => ({ ...prev, u: value[0] }))}
                    min={50}
                    max={800}
                    step={10}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tiempo estimado resolucion (t): {terrenoParams.t} meses</Label>
                  <Slider
                    value={[terrenoParams.t]}
                    onValueChange={(value) => setTerrenoParams((prev) => ({ ...prev, t: value[0] }))}
                    min={1}
                    max={12}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Dias Habiles Transcurridos (dhr): {terrenoParams.dhr}</Label>
                  <Slider
                    value={[terrenoParams.dhr]}
                    onValueChange={(value) => setTerrenoParams((prev) => ({ ...prev, dhr: value[0] }))}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Dias Habiles Necesarios (dhn): {terrenoParams.dhn}</Label>
                  <Slider
                    value={[terrenoParams.dhn]}
                    onValueChange={(value) => setTerrenoParams((prev) => ({ ...prev, dhn: value[0] }))}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Factor de complejidad (alpha)</Label>
                  <Select
                    value={terrenoParams.alpha.toString()}
                    onValueChange={(value) =>
                      setTerrenoParams((prev) => ({ ...prev, alpha: Number.parseFloat(value) }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {alphaOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Nivel de complejidad de los tramites (nc): {terrenoParams.nc}%</Label>
                  <Slider
                    value={[terrenoParams.nc]}
                    onValueChange={(value) => setTerrenoParams((prev) => ({ ...prev, nc: value[0] }))}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tiempo adicional de desplazamiento en terreno (td): {terrenoParams.td} horas</Label>
                  <Slider
                    value={[terrenoParams.td]}
                    onValueChange={(value) => setTerrenoParams((prev) => ({ ...prev, td: value[0] }))}
                    min={0}
                    max={7}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </div>
              
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Cantidad de Coordinador(es) TERRENO: {coorter}</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      Calculado automaticamente: 1 coordinador por cada 5 ejecutores
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cantidad de Digitalizador(es) TERRENO: {digit}</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      Calculado automaticamente: 1 digitalizador por cada 3 reconocedores junior
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cantidad de personal asignado TERRENO (xDT): {xDTTerreno}</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      Calculado automaticamente: rint + rjun + digit = {terrenoParams.rint} + {terrenoParams.rjun} +{" "}
                      {digit}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Factor p calculado</h4>
                  <p className="text-2xl font-bold text-blue-600">{resultadosTerreno.p.toFixed(4)}</p>
                </Card>
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Capacidad Terreno (Zter)</h4>
                  <p className="text-2xl font-bold text-green-600">{resultadosTerreno.Zter.toFixed(2)}</p>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cargas - Terreno</CardTitle>
              <CardDescription>Configuracion de cargas de trabajo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Cantidad de tramites pendientes de TERRENO de periodo(s) a proyectar (T)</Label>
                <Input
                  type="number"
                  value={terrenoParams.T}
                  onChange={(e) => setTerrenoParams((prev) => ({ ...prev, T: Number.parseInt(e.target.value) || 0 }))}
                  min={5}
                  max={10000}
                />
              </div>
              <div className="space-y-2">
                <Label>Cantidad de tramites pendientes de TERRENO de periodo(s) pasado(s) (Tr)</Label>
                <Input
                  type="number"
                  value={terrenoParams.Tr}
                  onChange={(e) => setTerrenoParams((prev) => ({ ...prev, Tr: Number.parseInt(e.target.value) || 0 }))}
                  min={0}
                  max={500000}
                />
              </div>
              <Card className="p-4">
                <h4 className="font-semibold mb-2">Carga Total (B)</h4>
                <p className="text-2xl font-bold text-orange-600">{resultadosTerreno.B.toFixed(2)}</p>
              </Card>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Costos - Terreno</CardTitle>
              <CardDescription>Configuracion de costos operativos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Costo Promedio por reconocedor integral de TERRENO</Label>
                <Input
                  type="number"
                  value={terrenoParams.cpromrint}
                  onChange={(e) =>
                    setTerrenoParams((prev) => ({ ...prev, cpromrint: Number.parseInt(e.target.value) || 0 }))
                  }
                  min={2000000}
                  max={20000000}
                />
              </div>
              <div className="space-y-2">
                <Label>Costo Promedio por reconocedor junior de TERRENO</Label>
                <Input
                  type="number"
                  value={terrenoParams.cpromrjun}
                  onChange={(e) =>
                    setTerrenoParams((prev) => ({ ...prev, cpromrjun: Number.parseInt(e.target.value) || 0 }))
                  }
                  min={2000000}
                  max={20000000}
                />
              </div>
              <div className="space-y-2">
                <Label>Costo Promedio por digitalizador de TERRENO</Label>
                <Input
                  type="number"
                  value={terrenoParams.cpromrdigit}
                  onChange={(e) =>
                    setTerrenoParams((prev) => ({ ...prev, cpromrdigit: Number.parseInt(e.target.value) || 0 }))
                  }
                  min={2000000}
                  max={20000000}
                />
              </div>
              <div className="space-y-2">
                <Label>Costo Promedio por coordinador de TERRENO</Label>
                <Input
                  type="number"
                  value={terrenoParams.cpromcoorter}
                  onChange={(e) =>
                    setTerrenoParams((prev) => ({ ...prev, cpromcoorter: Number.parseInt(e.target.value) || 0 }))
                  }
                  min={2000000}
                  max={20000000}
                />
              </div>
              <Card className="p-4">
                <h4 className="font-semibold mb-2">Costo Total (C)</h4>
                <p className="text-2xl font-bold text-red-600">${resultadosTerreno.C.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Costo por {xDTTerreno} ejecutores y {coorter} coordinadores durante {terrenoParams.t}{" "}
                  {terrenoParams.t === 1 ? "mes" : "meses"}
                </p>
              </Card>
            </CardContent>
          </Card>

          {/* PARTE 4 - Reporte de Optimización */}
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Optimizacion por tramite catastral para la Ejecucion de DTS</CardTitle>
              <CardDescription>Sistema de gestion de reportes para optimizacion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 mb-4">
                <Button onClick={incluirReporteTerreno} className="bg-green-600 hover:bg-green-700">
                  Incluir reporte
                </Button>
                <Button
                  onClick={() => exportarReportes("terreno")}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={reportesTerreno.length === 0}
                >
                  <Download className="h-4 w-4" />
                  Exportar Reportes ({reportesTerreno.length})
                </Button>
              </div>

              {reportesTerreno.length > 0 && (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>DT</TableHead>
                          <TableHead>Tipo Tramite</TableHead>
                          <TableHead>Personal Total</TableHead>
                          <TableHead>Coordinador</TableHead>
                          <TableHead>Reconocedor Integral</TableHead>
                          <TableHead>Reconocedor Junior</TableHead>
                          <TableHead>Digitalizador</TableHead>
                          <TableHead>Tasa</TableHead>
                          <TableHead>Tiempo</TableHead>
                          <TableHead>Complejidad</TableHead>
                          <TableHead>Nivel</TableHead>
                          <TableHead>Desplazamiento</TableHead>
                          <TableHead>Capacidad Oficina (Zof)</TableHead>
                          <TableHead>Capacidad Terreno (Zter)</TableHead>
                          <TableHead>Costo Total</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportesTerreno.map((reporte) => (
                          <TableRow key={reporte.id}>
                            <TableCell>{formatValue(reporte.direccionTerritorial)}</TableCell>
                            <TableCell className="max-w-xs truncate">{formatValue(reporte.tipoTramite)}</TableCell>
                            <TableCell>{reporte.xDT}</TableCell>
                            <TableCell>{reporte.coorter || 0}</TableCell>
                            <TableCell>{reporte.rint || 0}</TableCell>
                            <TableCell>{reporte.rjun || 0}</TableCell>
                            <TableCell>{reporte.digit || 0}</TableCell>
                            <TableCell>{reporte.u}</TableCell>
                            <TableCell>{reporte.t}</TableCell>
                            <TableCell>{reporte.alpha || 0}</TableCell>
                            <TableCell>{reporte.nc || 0}</TableCell>
                            <TableCell>{reporte.td || 0}</TableCell>
                            <TableCell>0</TableCell>
                            <TableCell>{reporte.zter?.toFixed(2) || 0}</TableCell>
                            <TableCell>${reporte.costoTotal.toLocaleString()}</TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline" onClick={() => eliminarReporteTerreno(reporte.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Contador Costo Total (CT)</h4>
                    <p className="text-2xl font-bold text-purple-600">${CTTerreno.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Basado en {reportesTerreno.length} reporte{reportesTerreno.length !== 1 ? "s" : ""}
                    </p>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>

          {/* PARTE 5 - Resumen de Optimización */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Optimizacion para la Ejecucion de DTS</CardTitle>
              <CardDescription>Analisis comparativo de asignacion vs costos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Asignacion Conservacion Vigencia TERRENO en ejecucion (Pr)</Label>
                <Input
                  type="number"
                  value={terrenoParams.Pr}
                  onChange={(e) => setTerrenoParams((prev) => ({ ...prev, Pr: Number.parseInt(e.target.value) || 0 }))}
                  min={0}
                  max={100000000000}
                />
              </div>

              <Card
                className={`p-4 ${terrenoParams.Pr > CTTerreno ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
              >
                <h4 className="font-semibold mb-2">Mensaje de Optimizacion</h4>
                <p
                  className={`text-lg font-medium ${terrenoParams.Pr > CTTerreno ? "text-green-700" : "text-red-700"}`}
                >
                  {mensajeOptimizacionTerreno}
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Asignacion: ${terrenoParams.Pr.toLocaleString()}</p>
                  <p>Costo Total: ${CTTerreno.toLocaleString()}</p>
                  <p>Diferencia: ${Math.abs(terrenoParams.Pr - CTTerreno).toLocaleString()}</p>
                </div>
              </Card>
            </CardContent>
          </Card>

          {/* PARTE 6 - Guardar */}
          <Card>
            <CardHeader>
              <CardTitle>Guardar Resultados</CardTitle>
              <CardDescription>Guarda el valor del Contador Costo Total para el resumen general</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={guardarCTTerreno} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Guardar CT Terreno (${CTTerreno.toLocaleString()})
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resumen">
          <Card>
            <CardHeader>
              <CardTitle>Resumen General</CardTitle>
              <CardDescription>Visualizacion consolidada de los costos totales de Oficina y Terreno</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Costo Total Oficina (Guardado)</h4>
                  <p className="text-2xl font-bold text-blue-600">${CTOficinaGuardado.toLocaleString()}</p>
                </Card>
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Costo Total Terreno (Guardado)</h4>
                  <p className="text-2xl font-bold text-green-600">${CTTerrenoGuardado.toLocaleString()}</p>
                </Card>
              </div>

              <Card className="p-4">
                <h4 className="font-semibold mb-2">Costo Total General (Guardado)</h4>
                <p className="text-3xl font-bold text-purple-600">
                  ${(CTOficinaGuardado + CTTerrenoGuardado).toLocaleString()}
                </p>
              </Card>

              <Button
                onClick={exportarReporteGeneral}
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                Exportar Reporte General
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

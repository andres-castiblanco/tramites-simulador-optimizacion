// Script para leer el archivo CSV y obtener las listas desplegables
async function readCSV() {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lista_Desplegables-lLa2rDZtXz95XrecAZLnzblJGXx4yc.csv",
    )
    const csvText = await response.text()

    console.log("Contenido del CSV:")
    console.log(csvText)

    // Parsear el CSV
    const lines = csvText.split("\n")
    const headers = lines[0].split(",")

    console.log("Headers:", headers)

    // Extraer las columnas de listas desplegables
    const oficinaIndex = headers.findIndex((h) => h.includes("OFICINA"))
    const terrenoIndex = headers.findIndex((h) => h.includes("TERRENO"))

    console.log("Índice Oficina:", oficinaIndex)
    console.log("Índice Terreno:", terrenoIndex)

    const oficinaOptions = []
    const terrenoOptions = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",")
      if (values[oficinaIndex] && values[oficinaIndex].trim()) {
        oficinaOptions.push(values[oficinaIndex].trim())
      }
      if (values[terrenoIndex] && values[terrenoIndex].trim()) {
        terrenoOptions.push(values[terrenoIndex].trim())
      }
    }

    console.log("Opciones Oficina:", oficinaOptions)
    console.log("Opciones Terreno:", terrenoOptions)
  } catch (error) {
    console.error("Error al leer el CSV:", error)
  }
}

readCSV()

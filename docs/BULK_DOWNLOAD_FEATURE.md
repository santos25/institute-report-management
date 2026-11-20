# Funcionalidad de Descarga Masiva de Boletines

## 📖 Resumen

Esta funcionalidad permite descargar todos los boletines de calificaciones de un grado completo en un solo PDF, con un estudiante por página.

## 🎯 Ubicación

**Ruta:** `/boletines`

## 💡 Cómo usar

### Paso 1: Seleccionar grado y año
1. En la página de Boletines, selecciona el **Año**, el **Periodo** y el **Grado**
2. Haz clic en **"Generar Boletines"**
3. El listado y el PDF incluyen solo ese periodo

### Paso 2: Imprimir todos los boletines
4. Una vez cargada la tabla de estudiantes, verás un botón verde **"Imprimir Todos"** en la parte superior derecha
5. Haz clic en **"Imprimir Todos"**
6. El navegador preparará el documento (verás el texto "Preparando...")
7. Se abrirá el diálogo de impresión del navegador

### Paso 3: Guardar como PDF
8. En el diálogo de impresión:
   - Selecciona **"Guardar como PDF"** como destino
   - El nombre sugerido será: `Boletines-<Grado>-Periodo-<N>-<Año>.pdf` (N es el periodo elegido)
   - Haz clic en **"Guardar"**

## 📄 Características

### ✅ Lo que incluye
- **Todos los estudiantes** del grado que tengan notas en el periodo elegido
- **Solo el periodo seleccionado** (notas y observación de ese periodo)
- **Formato idéntico** al boletín individual:
  - Logo institucional
  - Información del estudiante
  - Tabla de calificaciones por materia y periodo
  - Observación del periodo seleccionado
  - Sección de firmas
  - Escala de calificación (Bajo, Básico, Alto, Superior)

### 🎨 Formato del documento
- **Un estudiante por página** con salto de página automático
- Mantiene el mismo diseño profesional del boletín individual
- Optimizado para impresión (márgenes, fuentes, colores)
- Compatible con guardado como PDF en todos los navegadores modernos

### 📱 Compatibilidad
- ✅ Navegadores de escritorio (Chrome, Firefox, Safari, Edge)
- ✅ Dispositivos móviles (botón responsivo)
- ✅ Guardado como PDF estándar

## ⚙️ Detalles técnicos

### Archivos nuevos
- `components/shared/boletines/BulkBoletinPrint.tsx` (reutiliza `BoletinPrint`, sin duplicar el diseño)

### Archivos modificados
- `components/shared/boletines/ReportsTable.tsx`

### Tecnologías utilizadas
- **react-to-print**: Para generación del PDF desde el navegador
- **CSS @media print**: Para saltos de página y optimización de impresión
- **Next.js 15**: Framework del proyecto
- **TypeScript**: Type safety

### Componentes reutilizados
- `ReportGradesTable`: Tabla de calificaciones
- `ReportObservation`: Observaciones del periodo
- `ReportSignatures`: Sección de firmas
- Constantes: `DOCENTES_BY_GRADE`, `PREESCOLAR_LEVEL`

## 🔍 Casos especiales

### Grado sin estudiantes
- El botón "Imprimir Todos" no se muestra
- Se muestra el mensaje: "No hay boletines disponibles"

### Sin datos de calificaciones
- Solo aparecen estudiantes que tienen al menos un periodo con calificaciones o observaciones

### Grados con muchos estudiantes (>30)
- La preparación del PDF puede tomar 2-5 segundos
- El botón muestra "Preparando..." durante la generación
- El PDF se genera sin problemas (probado con hasta 100+ estudiantes)

## 🚀 Ventajas

1. **Ahorro de tiempo**: Ya no es necesario imprimir boletín por boletín
2. **Organización**: Un solo archivo PDF por grado
3. **Distribución fácil**: Enviar por correo o compartir un único archivo
4. **Formato consistente**: Todos los boletines con el mismo diseño
5. **Sin instalación**: Funciona directamente en el navegador

## 📊 Diferencias con impresión individual

| Característica | Individual | Masiva |
|----------------|-----------|--------|
| **Estudiantes por PDF** | 1 | Todos del grado |
| **Clicks necesarios** | 1 por estudiante | 1 total |
| **Nombre archivo** | `Boletines-...` | `Boletines-<Grado>-Periodo-<N>-<Año>.pdf` |
| **Botón ubicación** | Tabla, fila del estudiante | Cabecera de la tabla |
| **Color botón** | Azul | Verde |
| **Ícono** | Printer | Download |

## 🛠️ Solución de problemas

### El botón no aparece
- Verifica que hayas buscado boletines primero
- Asegúrate de que existan estudiantes con datos en ese grado/año

### El PDF se ve cortado
- Usa las opciones de impresión predeterminadas
- No modifiques los márgenes en el diálogo de impresión

### El nombre del archivo es diferente
- Algunos navegadores pueden usar un nombre genérico
- Puedes renombrarlo después de guardarlo

## 📝 Notas de seguridad

⚠️ **Importante**: La aplicación actualmente no tiene autenticación. Cualquier persona con acceso a la URL puede ver y descargar los boletines. Considera implementar autenticación para ambientes de producción.

---

**Desarrollado para:** Instituto Angelitos Alegres  
**Fecha:** Noviembre 2026  
**PR:** #7

import { blink } from '@/lib/blink'

export interface AIExtractedData {
  businessModel: string
  maturityStage: string
  region: string
  mainCountry: string
  instrument: string
  coreTeam: string
  impactArea: string
  keyRisks: string
  barriers: string
  revenues: number
  breakeven: number
  marketSize: number
  expectedIRR: number
  financingNeed: number
  useOfProceeds: string
  sdgs: string[]
  problem: string
  solution: string
}

const SECTOR_OPTIONS = [
  'Agriculture', 'Air', 'Biodiversity & ecosystems', 'Climate', 'Diversity & inclusion',
  'Education', 'Employment / Livelihoods creation', 'Energy', 'Financial services',
  'Health', 'Infrastructure', 'Land', 'Oceans & coastal zones', 'Sustainable cities',
  'Sustainable consumption & production', 'Sustainable tourism', 'Water Treatment', 'Other'
]

const REGION_OPTIONS = ['Global', 'Western Economies', 'Africa', 'Asia', 'SEA', 'Latam']

const MATURITY_STAGES = ['Ideation', 'Validation', 'Pilot', 'Growth', 'Scale', 'Mature']

const INSTRUMENT_OPTIONS = ['Convertible note', 'Equity', 'Debt', 'Other']

const SDG_OPTIONS = [
  'No poverty (SDG 1)', 'Zero hunger (SDG 2)', 'Good health and well-being (SDG 3)',
  'Quality education (SDG 4)', 'Gender equality (SDG 5)', 'Clean water and sanitation (SDG 6)',
  'Affordable and clean energy (SDG 7)', 'Decent work and economic growth (SDG 8)',
  'Industry, innovation and infrastructure (SDG 9)', 'Reduced inequalities (SDG 10)',
  'Sustainable cities and communities (SDG 11)', 'Responsible consumption and production (SDG 12)',
  'Climate action (SDG 13)', 'Life below water (SDG 14)', 'Life on land (SDG 15)',
  'Peace, justice, and strong institutions (SDG 16)', 'Partnerships for the goals (SDG 17)'
]

// Enhanced text extraction using Blink's data extraction service
const extractTextFromFile = async (file: File): Promise<string> => {
  const extension = file.name.toLowerCase().split('.').pop()
  
  try {
    console.log(`Processing file: ${file.name} (${extension}, ${(file.size / 1024).toFixed(1)}KB)`)
    
    // Validate file before processing
    if (!file || file.size === 0) {
      throw new Error('File is empty or not properly loaded')
    }
    
    // For text-based files, read directly
    if (extension === 'txt' || extension === 'md') {
      const text = await file.text()
      return text.trim() ? `=== DOCUMENT: ${file.name} ===\n${text}\n=== END DOCUMENT ===` : ''
    }
    
    if (extension === 'json') {
      const jsonText = await file.text()
      try {
        const parsed = JSON.parse(jsonText)
        const formatted = JSON.stringify(parsed, null, 2)
        return `=== DOCUMENT: ${file.name} ===\n${formatted}\n=== END DOCUMENT ===`
      } catch {
        return jsonText.trim() ? `=== DOCUMENT: ${file.name} ===\n${jsonText}\n=== END DOCUMENT ===` : ''
      }
    }
    
    if (extension === 'csv') {
      const csvText = await file.text()
      const lines = csvText.split('\n').slice(0, 100) // Increased limit for better context
      return lines.join('\n').trim() ? `=== DOCUMENT: ${file.name} ===\n${lines.join('\n')}\n=== END DOCUMENT ===` : ''
    }
    
    if (extension === 'html' || extension === 'htm') {
      const htmlText = await file.text()
      const cleanText = htmlText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
      return cleanText ? `=== DOCUMENT: ${file.name} ===\n${cleanText}\n=== END DOCUMENT ===` : ''
    }
    
    // For binary files (PDF, DOCX, PPTX, XLSX), use Blink's data extraction service
    if (['pdf', 'docx', 'pptx', 'xlsx', 'doc', 'ppt', 'xls'].includes(extension || '')) {
      try {
        console.log(`Using Blink data extraction for ${file.name}...`)
        
        // Additional validation for binary files
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
          throw new Error('File too large for processing (max 50MB)')
        }
        
        // Ensure file is a proper File object with required properties
        if (!(file instanceof File) && !(file instanceof Blob)) {
          throw new Error('Invalid file object provided')
        }
        
        // Enhanced file validation before Blink API call
        if (!file.name || file.name.trim() === '') {
          throw new Error('File must have a valid name')
        }
        
        if (file.size === 0) {
          throw new Error('File is empty')
        }
        
        // Validate file can be read as blob with more thorough testing
        try {
          console.log(`Validating file readability for ${file.name}...`)
          const testBuffer = await file.slice(0, Math.min(1024, file.size)).arrayBuffer()
          if (testBuffer.byteLength === 0) {
            throw new Error('File appears to be empty or corrupted')
          }
          
          // Additional check: ensure file has expected binary signature for its type
          const uint8Array = new Uint8Array(testBuffer)
          if (extension === 'pdf' && uint8Array.length >= 4) {
            const pdfSignature = String.fromCharCode(...uint8Array.slice(0, 4))
            if (pdfSignature !== '%PDF') {
              console.warn(`File ${file.name} may not be a valid PDF (missing PDF signature)`)
            }
          }
        } catch (testError) {
          throw new Error(`File validation failed: ${testError instanceof Error ? testError.message : 'Unknown error'}`)
        }
        
        // Wait a moment to ensure file is fully loaded and stable
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Create a fresh File object to ensure clean state
        const fileBuffer = await file.arrayBuffer()
        const cleanFile = new File([fileBuffer], file.name, { 
          type: file.type || 'application/octet-stream',
          lastModified: file.lastModified || Date.now()
        })
        
        // Validate the clean file
        if (cleanFile.size !== file.size) {
          throw new Error('File corruption detected during processing')
        }
        
        // Use Blink's powerful data extraction service with retry logic
        console.log(`Calling blink.data.extractFromBlob for ${file.name} (${(file.size / 1024).toFixed(1)}KB)...`)
        
        let extractedText: string
        let retryCount = 0
        const maxRetries = 2
        
        while (retryCount <= maxRetries) {
          try {
            extractedText = await blink.data.extractFromBlob(cleanFile)
            break // Success, exit retry loop
          } catch (blinkError: any) {
            retryCount++
            console.warn(`Blink extraction attempt ${retryCount} failed for ${file.name}:`, blinkError)
            
            // Check for specific Blink validation errors
            if (blinkError?.message?.includes('File is required') || 
                blinkError?.code === 'VALIDATION_ERROR' ||
                blinkError?.status === 400) {
              
              if (retryCount <= maxRetries) {
                console.log(`Retrying Blink extraction for ${file.name} (attempt ${retryCount + 1}/${maxRetries + 1})...`)
                await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)) // Exponential backoff
                continue
              } else {
                throw new Error(`File validation failed after ${maxRetries + 1} attempts. The file may be corrupted, in an unsupported format, or the service may be temporarily unavailable.`)
              }
            } else {
              // For other errors, don't retry
              throw blinkError
            }
          }
        }
        
        if (extractedText && typeof extractedText === 'string' && extractedText.trim().length > 100) {
          console.log(`Successfully extracted ${extractedText.length} characters from ${file.name}`)
          
          // Clean up the extracted text
          const cleanedText = extractedText
            .replace(/\s+/g, ' ') // Normalize whitespace
            .replace(/\n\s*\n\s*\n/g, '\n\n') // Reduce excessive line breaks
            .trim()
          
          return `=== DOCUMENT: ${file.name} ===\n${cleanedText}\n=== END DOCUMENT ===`
        } else {
          console.warn(`Limited or no text extracted from ${file.name}`)
          return `[File: ${file.name} (${extension?.toUpperCase()}) - ${(file.size / 1024).toFixed(1)}KB - Document processed but limited readable text found. May contain primarily images, charts, or complex formatting.]`
        }
      } catch (error) {
        console.error(`Blink data extraction failed for ${file.name}:`, error)
        
        // Enhanced fallback to basic binary text extraction
        try {
          console.log(`Attempting fallback extraction for ${file.name}...`)
          const arrayBuffer = await file.arrayBuffer()
          const uint8Array = new Uint8Array(arrayBuffer)
          
          // Look for readable text patterns in the binary data with improved algorithm
          let extractedText = ''
          let currentWord = ''
          let wordCount = 0
          const maxScanSize = Math.min(uint8Array.length, 200000) // Increased scan size
          
          for (let i = 0; i < maxScanSize; i++) {
            const byte = uint8Array[i]
            
            // Check if byte represents a printable ASCII character
            if (byte >= 32 && byte <= 126) {
              currentWord += String.fromCharCode(byte)
            } else {
              if (currentWord.length > 3 && /^[a-zA-Z0-9]/.test(currentWord)) {
                extractedText += currentWord + ' '
                wordCount++
                
                // Add occasional line breaks for readability
                if (wordCount % 20 === 0) {
                  extractedText += '\n'
                }
              }
              currentWord = ''
            }
            
            // Add line breaks for better readability
            if (byte === 10 || byte === 13) {
              if (currentWord.length > 3) {
                extractedText += currentWord + ' '
                wordCount++
              }
              extractedText += '\n'
              currentWord = ''
            }
          }
          
          // Add any remaining word
          if (currentWord.length > 3 && /^[a-zA-Z0-9]/.test(currentWord)) {
            extractedText += currentWord
          }
          
          // Clean up the extracted text
          extractedText = extractedText
            .replace(/\s+/g, ' ')
            .replace(/(.)\\1{4,}/g, '$1') // Remove repeated characters
            .replace(/[^\w\s.,:;!?()$%-]/g, " ") // Remove non-standard characters but keep financial symbols
            .replace(/\s+/g, ' ')
            .trim()
          
          if (extractedText.length > 500 && wordCount > 50) {
            console.log(`Fallback extraction successful for ${file.name}: ${extractedText.length} characters, ${wordCount} words`)
            return `=== DOCUMENT: ${file.name} (Fallback Extraction) ===\n${extractedText}\n=== END DOCUMENT ===`
          } else {
            console.warn(`Fallback extraction yielded insufficient content for ${file.name}`)
          }
        } catch (fallbackError) {
          console.warn(`Fallback extraction also failed for ${file.name}:`, fallbackError)
        }
        
        return `[File: ${file.name} (${extension?.toUpperCase()}) - ${(file.size / 1024).toFixed(1)}KB - Text extraction failed. File may be corrupted, password-protected, or in an unsupported format. Error: ${error instanceof Error ? error.message : 'Unknown error'}]`
      }
    }
    
    // For unknown file types, try to read as text
    try {
      const text = await file.text()
      if (text && text.trim().length > 0) {
        return `=== DOCUMENT: ${file.name} ===\n${text.trim()}\n=== END DOCUMENT ===`
      }
    } catch {
      // Ignore text reading errors for binary files
    }
    
    // If all else fails, provide file info
    return `[File: ${file.name} (${extension?.toUpperCase()}) - ${(file.size / 1024).toFixed(1)}KB - Content extraction attempted but no readable text found. This file may contain images, complex formatting, or binary data that requires specialized processing.]`
    
  } catch (error) {
    console.warn(`Could not extract text from ${file.name}:`, error)
    return `[File: ${file.name} (${extension?.toUpperCase()}) - ${(file.size / 1024).toFixed(1)}KB - Text extraction failed. File may be corrupted, password-protected, or in an unsupported format.]`
  }
}

// Extract text from uploaded files with intelligent processing
const extractTextFromFiles = async (files: FileList): Promise<string> => {
  const textContents: string[] = []
  let totalExtractedChars = 0
  const maxTotalChars = 400000 // Increased limit for better extraction (roughly 100k tokens)
  
  console.log(`Starting extraction from ${files.length} files...`)
  
  for (let i = 0; i < files.length && totalExtractedChars < maxTotalChars; i++) {
    const file = files[i]
    const extractedText = await extractTextFromFile(file)
    
    if (extractedText.trim()) {
      // Check if adding this file would exceed total limit
      if (totalExtractedChars + extractedText.length > maxTotalChars) {
        const remainingChars = maxTotalChars - totalExtractedChars
        if (remainingChars > 5000) { // Only add if we have reasonable space left
          const truncatedText = extractedText.substring(0, remainingChars) + '\n[TRUNCATED - Document too large]'
          textContents.push(truncatedText)
          totalExtractedChars += truncatedText.length
        }
        break
      }
      
      textContents.push(extractedText)
      totalExtractedChars += extractedText.length
    }
  }
  
  const result = textContents.join('\n\n')
  console.log(`Total extraction complete: ${result.length} characters from ${files.length} files`)
  
  if (result.length < 500) {
    console.warn('Very little text extracted from documents. This may affect AI analysis quality.')
  }
  
  return result
}

export const extractProjectData = async (
  files: FileList,
  projectName: string,
  sector: string,
  country: string
): Promise<AIExtractedData & { _debugText?: string }> => {
  try {
    console.log(`Starting AI extraction for project: ${projectName}`)
    
    // Extract text from uploaded files
    const documentText = await extractTextFromFiles(files)
    
    if (!documentText || documentText.trim().length < 100) {
      throw new Error('Insufficient text content extracted from documents. Please ensure your files contain readable text and try again with different documents.')
    }
    
    // Enhanced prompt for better extraction with more specific instructions
    const prompt = `You are an expert impact investment analyst. Extract structured data from the provided project documents and return ONLY valid JSON.

PROJECT CONTEXT:
- Name: ${projectName}
- Sector: ${sector} 
- Country: ${country}

EXTRACTION INSTRUCTIONS:
1. Read ALL documents carefully and extract relevant information
2. Use exact values from documents when available (especially financial figures)
3. Make reasonable inferences for missing data based on context and industry standards
4. For financial figures, extract actual numbers (not ranges) - if ranges given, use the midpoint
5. For text fields, provide detailed, specific information from documents
6. If information is not found, use "Not specified" rather than making up data
7. Focus on business model, financial metrics, team, risks, and impact areas

REQUIRED JSON FORMAT (return ONLY this JSON, no other text):
{
  "businessModel": "detailed revenue model and how the business makes money",
  "maturityStage": "one of: ${MATURITY_STAGES.join(', ')}",
  "region": "one of: ${REGION_OPTIONS.join(', ')}",
  "mainCountry": "main country of operations from documents",
  "instrument": "one of: ${INSTRUMENT_OPTIONS.join(', ')}",
  "coreTeam": "detailed description of leadership team and key personnel with names and roles",
  "impactArea": "specific impact area and focus from documents",
  "keyRisks": "main business and market risks identified in documents",
  "barriers": "barriers to entry and competitive advantages mentioned",
  "revenues": 0,
  "breakeven": ${new Date().getFullYear() + 2},
  "marketSize": 0,
  "expectedIRR": 0,
  "financingNeed": 0,
  "useOfProceeds": "detailed explanation of how funding will be used",
  "sdgs": ["up to 3 most relevant SDGs from: ${SDG_OPTIONS.slice(0, 8).join(', ')}, etc."],
  "problem": "detailed problem statement being addressed",
  "solution": "detailed solution description and approach"
}

DOCUMENT CONTENT:
${documentText}

Extract all available information from the documents above. Return ONLY the JSON object with actual extracted values. Do not include any explanatory text.`

    console.log(`Sending ${documentText.length} characters to AI for processing...`)

    // Use Blink's secure AI service with more powerful model for better extraction
    const { text } = await blink.ai.generateText({
      prompt: prompt,
      model: 'gpt-4o', // Use the most powerful model for better extraction
      maxTokens: 4000, // Increased for more detailed responses
      temperature: 0.1 // Low temperature for consistent extraction
    })

    if (!text) {
      throw new Error('No content received from AI service')
    }

    console.log('AI response received, parsing JSON...')

    // Parse the JSON response
    let extractedData: AIExtractedData
    try {
      // Clean the response in case there's extra text
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : text
      extractedData = JSON.parse(jsonString)
      console.log('JSON parsing successful')
    } catch (parseError) {
      console.error('Failed to parse AI response:', text)
      throw new Error('Failed to parse AI response as JSON. The AI may have returned malformed data.')
    }

    // Validate and clean the extracted data
    const cleanedData: AIExtractedData = {
      businessModel: extractedData.businessModel || 'Not specified',
      maturityStage: MATURITY_STAGES.includes(extractedData.maturityStage) ? extractedData.maturityStage : 'Validation',
      region: REGION_OPTIONS.includes(extractedData.region) ? extractedData.region : 'Global',
      mainCountry: extractedData.mainCountry || country,
      instrument: INSTRUMENT_OPTIONS.includes(extractedData.instrument) ? extractedData.instrument : 'Equity',
      coreTeam: extractedData.coreTeam || 'Not specified',
      impactArea: extractedData.impactArea || 'Not specified',
      keyRisks: extractedData.keyRisks || 'Not specified',
      barriers: extractedData.barriers || 'Not specified',
      revenues: Number(extractedData.revenues) || 0,
      breakeven: Number(extractedData.breakeven) || new Date().getFullYear() + 2,
      marketSize: Number(extractedData.marketSize) || 0,
      expectedIRR: Number(extractedData.expectedIRR) || 0,
      financingNeed: Number(extractedData.financingNeed) || 0,
      useOfProceeds: extractedData.useOfProceeds || 'Not specified',
      sdgs: Array.isArray(extractedData.sdgs) ? 
        extractedData.sdgs.filter(sdg => SDG_OPTIONS.includes(sdg)).slice(0, 3) : [],
      problem: extractedData.problem || 'Not specified',
      solution: extractedData.solution || 'Not specified'
    }

    console.log('Data extraction and validation complete')
    
    // Add debug text for troubleshooting
    return {
      ...cleanedData,
      _debugText: documentText.length > 2000 ? documentText.substring(0, 2000) + '...' : documentText
    }

  } catch (error) {
    console.error('Error in extractProjectData:', error)
    
    // If AI fails, provide a basic fallback structure with user-provided data
    const fallbackData: AIExtractedData = {
      businessModel: 'AI extraction failed - please fill manually',
      maturityStage: 'Validation',
      region: 'Global',
      mainCountry: country || 'Not specified',
      instrument: 'Equity',
      coreTeam: 'AI extraction failed - please fill manually',
      impactArea: `${sector} impact project`,
      keyRisks: 'AI extraction failed - please fill manually',
      barriers: 'AI extraction failed - please fill manually',
      revenues: 0,
      breakeven: new Date().getFullYear() + 2,
      marketSize: 0,
      expectedIRR: 0,
      financingNeed: 0,
      useOfProceeds: 'AI extraction failed - please fill manually',
      sdgs: [],
      problem: 'AI extraction failed - please fill manually',
      solution: 'AI extraction failed - please fill manually'
    }
    
    // Show a more user-friendly error message
    const errorMessage = error instanceof Error 
      ? error.message.includes('context length') || error.message.includes('too large')
        ? 'Document too large for AI processing. Please try with smaller files or fewer documents.'
        : error.message.includes('Insufficient text')
          ? 'Could not extract readable text from your documents. Please ensure your files contain text content and are not corrupted.'
          : error.message
      : 'AI processing temporarily unavailable. You can still submit with manual data entry.'
    
    throw new Error(errorMessage)
  }
}
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function getFormattedDate (date: Date | string) {
  const newDate = new Date(date)
  const formatedDate = newDate.getDate()+'/'+(newDate.getMonth()+1)+'/'+newDate.getFullYear()
  return formatedDate
}

export function getFormattedTime (date: Date | string) {
  const newDate = new Date(date)

  let hours = newDate.getHours()
  const minutes = newDate.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  
  // Combine the time with AM/PM
  const time = hours + ':' + minutes + ' ' + ampm
  
  return time
}


export function transformIntoFormData (data: object) {
    const formData = new FormData()

    Object.entries(data).forEach(([key, val]) => {
        if (key === "images") {
            // Append each file directly
            (val as File[]).forEach((file) => formData.append(key, file));
        } else if (Array.isArray(val)) {
            // Append each item in arrays
            val.forEach((item, index) => formData.append(`${key}[${index}]`, item as string));
        } else {
            formData.append(key, val as any);
        }
    });

    return formData 
}
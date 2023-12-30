import axiosInstance from '@/api/axios/axios'
import { getCookie } from 'cookies-next'

export const Lang = async () => {
    const lanURL = getCookie('selectedLanguage')
    const res = await axiosInstance(`/locals/${lanURL}`)
    if(!res.data) throw new Error('failed to fetch')
    const configData = res.data
    return configData
}

// import axiosInstance from "@/api/axios/axios"
// import { GetServerSideProps, InferGetServerSidePropsType } from "next"

// interface Data {
//     title: string,
//     description: string,
//     favicon: string
// }

// // export const getServerSideProps : GetServerSideProps<any> = async() => {
// //     const res = await axiosInstance('/config')
// //     if(!res.data) throw new Error('failed to fetch')
// //     const data = res.data.metadata
// //     return data
// // }

// // export default async function MetaData({data}:InferGetServerSidePropsType<typeof getServerSideProps>) {
// //     return data
// // }


// export default async function MetaData() {
//     const res = await axiosInstance('/config')
//     if(!res.data) throw new Error('failed to fetch')
//     const meta = res.data.metadata
//     return meta
// }

    
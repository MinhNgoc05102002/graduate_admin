import { Fetcher } from "swr";
import request from "~/services/axios";
import { IPosts } from "~/types/IBlog";

export const registerAccount = async() => {

}

export const getAllPosts = async () => {
    const data:any = await request.get("/WeatherForecast");
    return data;
}

export const handlePosts = async (dataReq:IPosts) => {
    const data: IPosts[] = await request.post("/posts",{
        ...dataReq
    });
    return data;
}
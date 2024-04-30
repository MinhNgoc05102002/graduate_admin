import { useState } from "react";
import { mutate } from "swr";
import { useAppDispatch, useAppSelector } from "~/redux/hook";
import { inforUser, logout } from "~/redux/slices/authSlice";
import { Get } from "~/services/axios";
import { handlePosts } from "~/services/blogsApi";
import { IPosts } from "~/types/IBlog";


const keyPost = '/api/user/123';
function Home() {
    const userData = useAppSelector(inforUser);
    console.log(userData);

    let [data, setData] = useState({});

    // const { data, error, isLoading } = useSWR<IPosts[]>(keyPost, getAllPosts, {
    //     revalidateIfStale: false,
    //     revalidateOnFocus: false,
    //     revalidateOnReconnect: false
    // })
    const dispatch = useAppDispatch();
    const handleLogout = () => {
        dispatch(logout())
    }

    // if (error) return <div>Xảy ra lỗi</div>

    const handleClick = async () => {
        const dataSubmit: IPosts = {
            id: "s",
            title: 'ssd'
        }
        const data = await handlePosts(dataSubmit);
        console.log(data);
        mutate(keyPost);
    }

    // const callAPIWeather = () => {
    //     Get("/WeatherForecast/test", {}, userData?.token ?? "")
    //     .then((res) => {
    //         console.log(res);
    //         setData(res.data);
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     })
    // }


    return (<div>
        {/* <button onClick={callAPIWeather}>Click</button> */}
        <button type="button" onClick={handleLogout}>logout</button>

        {/* {isLoading || !data ? <>Loading san pham</> : data.map((post) => {
            return <div key={Math.random()}>{post.id} {post.title}</div>
        })} */}

        {JSON.stringify(data)}
    </div>);
}

export default Home;
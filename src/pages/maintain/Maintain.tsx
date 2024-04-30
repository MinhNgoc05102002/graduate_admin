import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "~/components/Loading/Index";
import { useAppSelector } from "~/redux/hook";
import { isLogin, logging } from "~/redux/slices/authSlice";


export default function Maintain() {
    const isLoading = useAppSelector(logging);

    return (
    <>
        <Loading isLoading={isLoading}/>
        {isLoading ? null : 
            // <!--Under Maintenance -->
            <div className="container-xxl container-p-y">
            <div className="misc-wrapper" style={{minHeight: "calc(100vh - (8.625rem * 2))"}}>
                <h2 className="mb-2 mx-2">Tính năng này đang được phát triển!</h2>
                <p className="mb-4 mx-2">Chúng tôi rất tiếc vì sự bất tiện này</p>
                {/* <a href="index.html" className="btn btn-primary">Back to home</a> */}
                <div className="mt-4">
                <img
                    src="/src/assets/img/illustrations/girl-doing-yoga-light.png"
                    alt="girl-doing-yoga-light"
                    width="500"
                    className="img-fluid"
                    data-app-dark-img="illustrations/girl-doing-yoga-dark.png"
                    data-app-light-img="illustrations/girl-doing-yoga-light.png"
                />
                </div>
            </div>
            </div>
            // <!-- /Under Maintenance -->

        }
    </>)
};

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "~/components/Loading/Index";
import { useAppSelector } from "~/redux/hook";
import { isLogin, logging } from "~/redux/slices/authSlice";


export default function NotFound() {
    const navigate = useNavigate();
    const isLoading = useAppSelector(logging);
    const isLoggedIn = useAppSelector(isLogin);

    // useEffect(() => {
    //     setTimeout(() => {
    //         navigate('/login');
    //     })
    // }, [])

    return (
    <>
        <Loading isLoading={isLoading}/>
        {isLoading ? null : 
            // <!-- Error -->
            <div className="container-xxl container-p-y">
                <div className="misc-wrapper">
                <h2 className="mb-2 mx-2">Không tìm thấy trang :(</h2>
                <p className="mb-4 mx-2">Oops! 😖 Trang bạn yêu cầu không có trên hệ thống.</p>
                {/* <a href="index.html" className="btn btn-primary">Trở về</a> */}
                <Link to={isLoggedIn ? "/": "/login"} className="btn btn-primary">
                    Trở về
                </Link>
                <div className="mt-3">
                    <img
                        src="/src/assets/img/illustrations/page-misc-error-light.png"
                        alt="page-misc-error-light"
                        width="500"
                        className="img-fluid"
                        data-app-dark-img="illustrations/page-misc-error-dark.png"
                        data-app-light-img="illustrations/page-misc-error-light.png"
                    />
                </div>
                </div>
            </div>
            // <!-- /Error -->
        }
    </>)
};

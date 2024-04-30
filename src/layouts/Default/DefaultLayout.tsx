// // <!-- Favicon -->
// import "../../assets/img/favicon/favicon.ico"

// // <!-- Icons. Uncomment required icon fonts -->
// import "../../assets/vendor/fonts/boxicons.css"

// // <!-- Core CSS -->
// import "../../assets/vendor/css/core.css"
// import "../../assets/vendor/css/theme-default.css"
// import "../../assets/css/demo.css"

// // <!-- Vendors CSS -->
// import "../../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css"

// // <!-- Page CSS -->

// // <!-- Helpers -->
// import "../../assets/vendor/js/helpers.js"

// // <!--! Template customizer & Theme config files MUST be included after core stylesheets and helpers.js in the <head> section -->
// // <!--? Config:  Mandatory theme config file contain global vars & default theme options, Set your preferred theme option in this file.  -->
// import "../../assets/js/config.js"


// // <!-- Core JS -->
// // <!-- build:js assets/vendor/js/core.js -->
// import "../../assets/vendor/libs/jquery/jquery.js"
// import "../../assets/vendor/libs/popper/popper.js"
// import "../../assets/vendor/js/bootstrap.js"
// import "../../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"

// import "../../assets/vendor/js/menu.js"
// // <!-- endbuild -->

// // <!-- Vendors JS -->

// // <!-- Main JS -->
// import "../../assets/js/main.js"

// // <!-- Page JS -->

// // <!-- Place this tag in your head or just before your close body tag. -->
// import "https://buttons.github.io/buttons.js"


// // import Header from "../components/Header/Header";
// // import styles from "./DefaultLayout.module.scss"
// import classNames from "classnames/bind";
import Sidebar from "../components/Sidebar/Sidebar.js"
import Header from "../components/Header/Header.js"
import Footer from "../components/Footer/Footer.js"
import { useAppSelector } from "~/redux/hook.js";
import { inforUser } from "~/redux/slices/authSlice.js";

// const cx = classNames.bind(styles);

function DefaultLayout({ children }: any) {

    return (<>
        {/* <Header /> */}

        {/* <!-- Layout wrapper --> */}
        <div className="layout-wrapper layout-content-navbar layout-without-menu">
            <div className="layout-container">

                {/* <!-- Menu --> */}
                <Sidebar />
                {/* <!-- / Menu --> */}

                {/* <!-- Layout container --> */}
                <div className="layout-page">
                    
                    {/* <!-- Navbar --> */}
                    <Header />
                    {/* <!-- / Navbar --> */}

                    {/* <!-- Content wrapper --> */}
                    <div className="content-wrapper">
                        
                        {children}

                        {/* <!-- Footer --> */}
                        <Footer />
                        {/* <!-- / Footer --> */}

                        <div className="content-backdrop fade"></div>
                    </div>
                    {/* <!-- Content wrapper --> */}
                </div>
                {/* <!-- / Layout page --> */}
            </div>
        </div>
        {/* <!-- / Layout wrapper --> */}
    </>);
}

export default DefaultLayout;
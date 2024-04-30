// // <!-- Core JS -->
// //     <!-- build:js assets/vendor/js/core.js -->
// // <!-- Favicon -->
// import "../../assets/img/favicon/favicon.ico"

// // <!-- Fonts -->
// // import "https://fonts.googleapis.com" 
// // import "https://fonts.gstatic.com" 
// // import "https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"


// // <!-- Icons. Uncomment required icon fonts -->
// import "../../assets/vendor/fonts/boxicons.css" 

// // <!-- Core CSS -->
// import "../../assets/vendor/css/core.css"
// import "../../assets/vendor/css/theme-default.css"
// import "../../assets/css/demo.css" 

// // <!-- Vendors CSS -->
// import "../../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" 

// // <!-- Page CSS -->
// // <!-- Page -->
// import "../../assets/vendor/css/pages/page-auth.css" 
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






// import Header from "../components/Header/Header";
// import styles from "./DefaultLayout.module.scss"
// import classNames from "classnames/bind";

// const cx = classNames.bind(styles);

function AuthLayout({children} : any) {
    return ( <>
        {/* <Header /> */}
        {children} 
    </> );
}

export default AuthLayout;
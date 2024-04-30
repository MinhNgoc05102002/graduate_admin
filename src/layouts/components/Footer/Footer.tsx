
export default function Footer() {
    return (
        <>
            {/* <!-- Footer --> */}
            <footer className="content-footer footer bg-footer-theme">
                <div className="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
                    <div className="mb-2 mb-md-0">
                        © {(new Date().getFullYear())}
                        , made with ❤️
                        {/* <a href="https://themeselection.com" className="footer-link fw-bolder"></a> */}
                    </div>
                    <div>
                        <a className="footer-link me-4">License</a>
                        <a className="footer-link me-4">More Info</a>

                        <a
                            className="footer-link me-4"
                        >Documentation</a>

                        <a
                            className="footer-link me-4"
                        >Support</a>
                    </div>
                </div>
            </footer>
            {/* <!-- / Footer --> */}
        </>
    )
};

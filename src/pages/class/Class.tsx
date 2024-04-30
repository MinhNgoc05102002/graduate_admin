import CloseIcon from '@mui/icons-material/Close';
import { DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import ListCredit from "~/components/Account/ListCredit";
import ListFolder from "~/components/Account/ListFolder";
import ListMember from "~/components/Class/ListMember";
import { BootstrapDialog } from "~/components/Common";
import Loading, { PopupMenu } from "~/components/Loading/Index";
import BoxCreditInModal from "~/components/ModalAdd/BoxCreditInModal";
import BoxFolderInModal from "~/components/ModalAdd/BoxFolderInModal";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { Post } from "~/services/axios";
import { IClass } from "~/types/IClass";
import { ICredit } from "~/types/ICredit";
import { CheckResponseSuccess, GetIdFromCurrentPage } from "~/utils/common";
import NotFound from "../notfound/NotFound";
import styles from "./Class.module.scss";
import Credit from '../credit/Credit';
const cx = classNames.bind(styles);

const LIST_NAVBAR = [
    {
        id: "CREDIT",
        title: "Bộ thẻ",
        url: '/',
        component: ListCredit,
    },
    {
        id: "FOLDER",
        title: "Thư mục",
        url: '/folders',
        component: ListFolder,
    },
    {
        id: "CLASS",
        title: "Thành viên",
        url: '/members',
        component: ListMember,
    },
];

const TYPE_POPUP = [
    {
        id: "CREDIT",
        title: "Thêm bộ thẻ",
        apiGetAll: '/api/Credit/get-list-credit-created-by-user',
        apiGetCurrent: '/api/Credit/get-list-credit-by-class',
        apiSubmit: 'api/Class/add-item-to-class',
        key: 'creditId',
        component: BoxCreditInModal,
    },
    {
        id: "FOLDER",
        title: "Thêm thư mục",
        apiGetAll: '/api/Folder/get-folder-by-username',
        apiGetCurrent: '/api/Folder/get-list-folder-by-class',
        apiSubmit: 'api/Class/add-item-to-class',
        key: 'folderId',
        component: BoxFolderInModal,
    },
]

export default function Classes() {
    const [content, setContent] = useState(LIST_NAVBAR[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [_class, setClass] = useState<IClass|null>(null);
    const userData = useAppSelector(inforUser);
    const classId = GetIdFromCurrentPage();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [pageIndex, setPageIndex] = useState(1);
    const [totalPage, setToTalPage] = useState(1);
    const [listCredit, setListCredit] = useState<ICredit[]>([]);

    const [searchAll, setSearchAll] = useState("");
    const [pageIndexAll, setPageIndexAll] = useState(1);
    const [totalPageAll, setToTalPageAll] = useState(1);
    const [listAll, setListAll] = useState([]);
    const [listSelected, setListSelected] = useState<any>([]);
    const [reload, setReload] = useState(false);

    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState(TYPE_POPUP[0]);

    useEffect(() => {
        getInfoClass();
        // getListCredit();
        // getListFolder();
    }, [classId]);

    // useEffect(() => {
    //     if (open) {
    //         getListSelected();
    //         getListAll();
    //     }
    // }, [modalType, open])


    const getInfoClass = async () => {
        // dispatch(login(formLogin))
        setIsLoading(true);
        await Post(
            "/api/Class/get-class-by-id", 
            classId, 
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let _class = res?.returnObj;
                if (_class) {
                    setClass(_class);
                }
            }
            else {
                toast.error("Đã có lỗi xảy ra.");
            }
        })
        .catch((err) => {
            toast.error("Đã có lỗi xảy ra.");
            console.log(err);
        })
        setIsLoading(false);
    }; 

    const getListSelected = async (modalType:any) => {
        setIsLoading(true);

        await Post(
            modalType.apiGetCurrent, 
            {
                pageSize: 100,
                pageIndex: 0,
                username: "",
                containerId: classId
            }, 
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let listRes = res?.returnObj?.listResult;
                let listSelected = listRes.map((res:any) => res[modalType.key])
                setListSelected(listSelected);
            }
            else {
                toast.error("Đã có lỗi xảy ra.");
            }
        })
        .catch((err) => {
            toast.error("Đã có lỗi xảy ra.");
            console.log(err);
        })
        setIsLoading(false);
    }

    const getListAll = async (modalType:any) => {
        setIsLoading(true);

        await Post(
            modalType.apiGetAll, 
            {
                pageSize: 100,
                pageIndex: pageIndexAll,
                searchText: searchAll,
                username: userData?.username,
            }, 
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let listRes = res?.returnObj?.listResult;
                setListAll(listRes);
                setToTalPage(res?.returnObj?.totalPage)
            }
            else {
                toast.error("Đã có lỗi xảy ra.");
            }
        })
        .catch((err) => {
            toast.error("Đã có lỗi xảy ra.");
            console.log(err);
        })
        setIsLoading(false);
    };

    const handleDelete = async () => {
        Swal.fire({
            title: "Bạn chắc chắn xóa lớp học này?",
            text: "Hành động này sẽ không thể hoàn tác!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Hủy",
            confirmButtonText: "Tiếp tục"
        }).then(async (result) => {
            if (result.isConfirmed) {
                // call api delete
                // setIsLoading(true);
                await Post(
                    "/api/Class/delete-class",
                    {
                        classId: classId
                    },
                ).then((res) => {
                    if (CheckResponseSuccess(res)) {
                        // setIsLoading(false);
                        Swal.fire({
                            title: "Đã xóa thành công!",
                            icon: "success",
                            timer: 700,
                        });
                        navigate(-1)
                    }
                    else {
                        toast.error("Đã có lỗi xảy ra.");
                    }
                })
                .catch((err) => {
                    toast.error("Đã có lỗi xảy ra.");
                    console.log(err);
                })
                // setIsLoading(false);
            }
        });
    }

    const handleSearch = (e:any = null) => {
        setPageIndex(1)
        e?.preventDefault();
        // getRecentCredit()
    }

    const handleNextPageFlashcard = (index: number) => {
        let newPageIndex = pageIndexAll + index;
        if (newPageIndex >= 1 && newPageIndex <= totalPageAll) {
            setPageIndexAll(newPageIndex);
        }
    }

    const handleSubmit = async () => {
        setOpen(false);
        // call api 
        setIsLoading(true);
        await Post(
            modalType.apiSubmit,
            {
                classId: classId,
                listCreditId: modalType.id == 'CREDIT' ? listSelected : null,
                listFolderId: modalType.id == 'FOLDER' ? listSelected : null
            },
        ).then((res) => {
            if (CheckResponseSuccess(res)) {
                toast.success("Cập nhật thành công");
                setReload(true);
            }
            else {
                toast.error("Đã có lỗi xảy ra.");
            }
        })
        .catch((err) => {
            toast.error("Đã có lỗi xảy ra.");
            console.log(err);
        })
        // setListSelected([])
        setIsLoading(false);
    }

    const handleJoinClass = async () => {
        setIsLoading(true);
        await Post(
            "/api/Class/join-class",
            {
                classId: classId,
            },
        ).then((res) => {
            if (CheckResponseSuccess(res)) {
                Swal.fire({
                    icon: "success",
                    title: "Tham gia lớp học thành công",
                    showConfirmButton: false,
                    timer: 600,
                });

                getInfoClass();
                setReload(true);
            }
            else {
                toast.error("Đã có lỗi xảy ra.");
            }
        })
        .catch((err) => {
            toast.error("Đã có lỗi xảy ra.");
            console.log(err);
        })
        // setListSelected([])
        setIsLoading(false);
    }

    const handleCheckInModal = (checked: any, creditId: any) => {
        if (checked) {
            setListSelected((prev: any) => [...prev, creditId]);
        }
        else {
            let newList = listSelected.filter((c: any) => c != creditId);
            setListSelected(newList);
        }
    }

    const handleOpen = async (popup:any) => {
        setModalType(popup);
        await Promise.all([
            getListSelected(popup),
            getListAll(popup)
        ]).then((response: any) => {
            setOpen(true);
        });
    }

    if (!_class) {
        return (
            <>
                {isLoading ? null : <NotFound />}
                <Loading isLoading={isLoading}/>
                <ToastContainer />
            </>
        )
    }

    return (
        <>
            <Loading isLoading={isLoading}/>
            {/* <ToastContainer /> */}

            <div className={`container-xxl flex-grow-1 container-p-y ${styles.container}`}>

                <div className={styles.header_author}>
                    <div className="d-flex align-items-center">
                        {/* <div className={styles.count}>5 bộ thẻ</div>

                        <div className="">tạo bởi</div>
                        <div className={styles.avt}>
                            <Link to={`/account`} className="avatar align-items-center d-flex w-auto">
                                <img src="http://localhost:5173/src/assets/img/avatars/ngoc.jpg" className="w-px-20 h-auto rounded-circle" />
                            </Link>
                        </div>
                        <Link to={`/account/`} className={styles.name}>
                            <span className="fw-semibold d-block">ngoc</span>
                        </Link> */}

                        <div className={styles.title}>
                            <h2 className={styles.name}>
                                <i className={`bx bx-group ${styles.icon}`}></i>
                                {_class.name}
                            </h2>

                            <div className={styles.descrip}>
                                {_class.description}
                            </div>
                        </div>
                        
                    </div>
                    
                    <div className={styles.btn}>
                        <Tooltip title="Chia sẻ" placement="top" arrow>
                            <span className='bx bxs-share-alt' onClick={() => {navigator.clipboard.writeText(window?.location?.toString()); toast.success('Đã sao chép vào bảng nhớ tạm')}}></span>
                        </Tooltip>
                        {/* nếu là member và class cho phép member thêm */}
                        { ((_class.joined && _class.acceptEdit) || _class.createdBy == userData?.username) ? 
                        <>
                            <Tooltip  title="Thêm bộ thẻ" placement="top" arrow>
                                <span className='bx bx-list-plus' onClick={() => {handleOpen(TYPE_POPUP[0]); }}></span>
                            </Tooltip>
                            <Tooltip title="Thêm thư mục" placement="top" arrow>
                                <span className='bx bx-folder' onClick={() => {handleOpen(TYPE_POPUP[1]); }}></span>
                            </Tooltip>
                            {userData?.username == _class.createdBy ? 
                                <PopupMenu 
                                    renderBtn={(handleClick:any) => (
                                        <span id="demo-positioned-button" onClick={handleClick} className='bx bx-dots-horizontal-rounded'></span>
                                    )}
                                    renderItem={(handleClose:any) => (
                                        <div>
                                            <MenuItem onClick={() => navigate(`/create-class/${_class.classId}`)} className="menu_item">
                                                <span className='bx bxs-pencil icon'></span>
                                                Chỉnh sửa
                                            </MenuItem>
                                            <MenuItem onClick={() => {handleClose(); handleDelete();}} className="menu_item">
                                                <span className='bx bx-trash icon'></span>
                                                Xóa lớp học
                                            </MenuItem>
                                        </div>
                                    )}
                                />: null}
                        </> : null}

                        {(!_class.joined &&  !(_class.createdBy == userData?.username)) ? 
                        <>
                            <span onClick={() => handleJoinClass()} className={`${styles.join_btn} btn btn-primary`}>Tham gia lớp học</span>
                        </> : null}

                        {/* <Tooltip title="Xóa, Sao chép, ..." placement="top" arrow>
                            <span className='bx bx-dots-horizontal-rounded'></span>
                        </Tooltip> */}
                    </div>
                </div>
                
                <div className="tab">
                    <div className={cx("navbar")}>
                        <div className={cx("navbar_container")}>
                            {/* {LIST_NAVBAR.map((nav) => {
                                return (
                                    <NavLink key={nav.id} className={cx("navbar_item")} to={nav.url}>
                                        {({ isActive }) => {
                                            return ((
                                                <>
                                                    <span className={cx("", { title_active: isActive })}>{nav.title}</span>
                                                    <div className={cx("", { underline: isActive })}></div>
                                                </>
                                            ))
                                        }}
                                    </NavLink>
                                )
                            })} */}

                            {LIST_NAVBAR.map((nav) => {
                                return (
                                    <div key={nav.id} className={cx("navbar_item")} onClick={() => setContent(nav)}>
                                        <span className={cx("", { title_active: nav.id == content.id })}>{nav.title}</span>
                                        <div className={cx("", { underline: nav.id == content.id })}></div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Dialog add Credit */}
                <BootstrapDialog
                    onClose={() => setOpen(false)}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                    maxWidth={'sm'}
                    fullWidth={true}
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        {modalType.title}
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpen(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <DialogContent dividers>
                        <div className={` ${styles.search_container}  d-flex justify-content-between row g-0 mb-5`}>
                            <div className="combobox col-8">
                                {/* combobox ... */}
                            </div>

                            <div className={`d-flex col-4 align-items-center ${styles.box_search} ${styles.backgr_dialog} `}>
                                <i className="bx bx-search fs-4 lh-0"></i>
                                <form onSubmit={(e) => handleSearch(e)}>
                                    <input
                                        value={searchAll}
                                        onChange={(e) => setSearchAll(e.target.value)}
                                        onBlur={(e) => handleSearch()}
                                        type="text"
                                        className="form-control border-0 shadow-none"
                                        placeholder="Tìm kiếm..."
                                        aria-label="Tìm kiếm..."
                                    />
                                </form>
                            </div>
                        </div>
                        <div className={styles.modal_credit}>

                            {listAll.map((credit, index) => {
                                let checked = listSelected.some((item:any) => item == credit?.[modalType.key])
                                return (
                                    <div key={credit?.[modalType.key]}>
                                        <modalType.component data={credit} callBackCheck={handleCheckInModal} checked={checked}/>
                                    </div>)
                            })}
                        </div>

                        <nav aria-label="Page navigation">
                            <ul className="pagination justify-content-center mt-4">
                                <li className="page-item prev">
                                    <a onClick={() => handleNextPageFlashcard(-1)} className={`page-link fw-semibold ${styles.arrow} ${pageIndexAll > 1 ? styles.active : null}`}>
                                        <i className="tf-icon bx bx-chevron-left"></i>
                                        <span>Trước</span>
                                    </a>
                                </li>
                                {/* <li className="page-item active">
                    <a className="page-link">Trang 2 / 3</a>
                </li> */}
                                <li className="page-item">
                                    <a className={`page-link fw-semibold ${styles.page_size} `}>
                                        Trang {pageIndexAll} / {totalPageAll}
                                    </a>
                                </li>
                                <li className="page-item next">
                                    <a onClick={() => handleNextPageFlashcard(1)} className={`page-link fw-semibold ${styles.arrow} ${pageIndexAll < totalPageAll ? styles.active : null}`}>
                                        <span>Tiếp</span>
                                        <i className="tf-icon bx bx-chevron-right"></i>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </DialogContent>


                    <DialogActions>
                        {/* <Button autoFocus onClick={() => handleSubmit()}>
                            Lưu
                        </Button> */}
                        <button type="button" className={`btn btn-primary`} onClick={() => handleSubmit()}>Lưu</button>
                    </DialogActions>
                </BootstrapDialog>

                <div>
                    {content.component ? <content.component username={userData?.username} showTime={false} type="CLASS" setIsLoading={setIsLoading} reload={reload} setReload={setReload}/> : null}
                </div>

            </div>
        </>
    )
};
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import BoxCreditAccount from "~/components/Account/Box/BoxCreditAccount";
import Loading, { PopupMenu } from "~/components/Loading/Index";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { BASE_URL_MEDIA, Post } from "~/services/axios";
import { ICredit } from "~/types/ICredit";
import { CheckResponseSuccess, GetIdFromCurrentPage } from "~/utils/common";
import styles from "./Folder.module.scss";
import { IFolder } from "~/types/IFolder";
import NotFound from "../notfound/NotFound";
import BoxCredit from "~/components/BoxCredit/Index";
import Fab from "@mui/material/Fab";
import { SxProps } from "@mui/material/styles";
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { BootstrapDialog, fabGreenStyle } from "~/components/Common";
import BoxCreditInModal from "~/components/ModalAdd/BoxCreditInModal";
import { MenuItem } from "@mui/material";
import Swal from 'sweetalert2';

export default function Folder() {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [listCreditSelected, setListCreditSelected] = useState<any>([]);
    const [folder, setFolder] = useState<IFolder | null>(null);
    const userData = useAppSelector(inforUser);
    const folderId = GetIdFromCurrentPage();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [pageIndex, setPageIndex] = useState(1);
    const [totalPage, setToTalPage] = useState(1);
    const [listCredit, setListCredit] = useState<ICredit[]>([]);
    const [showMsg, setShowMsg] = useState(true);

    const [searchAll, setSearchAll] = useState("");
    const [pageIndexAll, setPageIndexAll] = useState(1);
    const [totalPageAll, setToTalPageAll] = useState(1);
    const [listCreditAll, setListCreditAll] = useState<ICredit[]>([]);

    useEffect(() => {
        getInfoFolder();
        getListCredit();
    }, [folderId]);

    
    useEffect(() => {
        getListCredit();
    }, [pageIndexAll]);

    const getInfoFolder = async () => {
        setIsLoading(true);
        await Post(
            "/api/Folder/get-folder-by-id",
            {
                pageSize: 5,
                pageIndex: pageIndex,
                searchText: search,
                containerId: folderId
            },
        ).then((res) => {
            if (CheckResponseSuccess(res)) {
                let folder = res?.returnObj;
                if (folder) {
                    setFolder(folder);
                    setListCredit(folder.credits);
                    setListCreditSelected(folder.credits.map((c:any) => c.creditId));
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

    const getListCredit = async () => {
        setIsLoading(true);
        await Post(
            "/api/Credit/get-list-credit-created-by-user",
            {
                pageSize: 100,
                pageIndex: pageIndexAll,
                searchText: searchAll,
                username: userData?.username
            },
        ).then((res) => {
            if (CheckResponseSuccess(res)) {
                let listCredit = res?.returnObj?.listResult;
                setListCreditAll(listCredit);
                setToTalPageAll(res?.returnObj?.totalPage)
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

    // chưa search được
    const handleSearch = (e: any = null) => {
        setPageIndex(1)
        e?.preventDefault();
        getInfoFolder()
    }

    const handleSearchCredit = (e: any = null) => {
        setPageIndexAll(1)
        e?.preventDefault();
        getListCredit();
    }

    const handleNextPage = (index: number) => {
        let newPageIndex = pageIndexAll + index;
        if (newPageIndex >= 1 && newPageIndex <= totalPageAll) {
            setPageIndexAll(newPageIndex);
        }
    }

    const handleCheckInModal = (checked: any, creditId: any) => {
        if (checked) {
            setListCreditSelected((prev: any) => [...prev, creditId]);
        }
        else {
            let newList = listCreditSelected.filter((c: any) => c != creditId);
            setListCreditSelected(newList);
        }
    }

    const handleSubmit = async () => {
        setOpen(false);

        // call api 
        setIsLoading(true);
        await Post(
            "/api/Folder/add-credit-to-folder",
            {
                folderId: folderId,
                listCreditId: listCreditSelected
            },
        ).then((res) => {
            if (CheckResponseSuccess(res)) {
                toast.success("Cập nhật thành công");
                getInfoFolder();
            }
            else {
                toast.error("Đã có lỗi xảy ra.");
            }
        })
        .catch((err) => {
            toast.error("Đã có lỗi xảy ra.");
            console.log(err);
        })

        setListCreditSelected([])
        setIsLoading(false);
    }

    const handleDelete = async () => {
        Swal.fire({
            title: "Bạn chắc chắn xóa thư mục này?",
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
                    "/api/Folder/delete-folder",
                    {
                        folderId: folderId
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


    if (!folder) {
        return (
            <>
                {isLoading ? null : <NotFound />}
                <Loading isLoading={isLoading} />
                <ToastContainer />
            </>
        )
    }

    return (
        <>
            <Loading isLoading={isLoading} />
            <ToastContainer />

            <div className={`container-xxl flex-grow-1 container-p-y ${styles.container}`}>

                <div className={styles.header_author}>
                    <div className="d-flex align-items-center">
                        <div className={styles.count}>{folder.countCredit} bộ thẻ</div>

                        <div className="">tạo bởi</div>
                        <div className={styles.avt}>
                            <Link to={`/account/${folder.createdBy}`} className="avatar align-items-center d-flex w-auto">
                                <img src={BASE_URL_MEDIA + '/' + folder.avatar} className="w-px-20 h-px-20 rounded-circle" />
                            </Link>
                        </div>
                        <Link to={`/account/${folder.createdBy}`} className={styles.name}>
                            <span className="fw-semibold d-block">{folder.createdBy}</span>
                        </Link>
                    </div>

                    {userData?.username == folder.createdBy ?
                        <div className={styles.btn}>
                            {/* Folder ko có chia sẻ  */}
                            {/* <Tooltip title="Chia sẻ" placement="top" arrow>
                                <span className='bx bxs-share-alt'></span>
                            </Tooltip> */}
                            <Tooltip onClick={() => setOpen(true)} title="Thêm bộ thẻ" placement="top" arrow>
                                <span className='bx bx-list-plus'></span>
                            </Tooltip>
                            <Tooltip title="Cập nhật" placement="top" arrow>
                                <PopupMenu 
                                    renderBtn={(handleClick:any) => (
                                        <span id="demo-positioned-button" onClick={handleClick} className='bx bx-dots-horizontal-rounded'></span>
                                    )}
                                    renderItem={(handleClose:any) => (
                                        <div>
                                            <MenuItem onClick={() => navigate(`/create-folder/${folder.folderId}`)} className="menu_item">
                                                <span className='bx bxs-pencil icon'></span>
                                                Chỉnh sửa
                                            </MenuItem>
                                            <MenuItem onClick={() => {handleClose(); handleDelete();}} className="menu_item">
                                                <span className='bx bx-trash icon'></span>
                                                Xóa thư mục
                                            </MenuItem>
                                        </div>
                                    )}
                                />
                            </Tooltip>
                        </div> : null}
                </div>
                <div className={styles.title}>
                    <h2 className={styles.name}>
                        <i className={`bx bx-folder ${styles.icon}`}></i>
                        {folder.name}
                    </h2>

                    <div className={styles.descrip}>
                        {folder.description}
                    </div>
                </div>


                <div className={` ${styles.search_container} row g-0`}>
                    <div className="combobox col-8">

                    </div>

                    <div className={`d-flex col-4 align-items-center ${styles.box_search}`}>
                        <i className="bx bx-search fs-4 lh-0"></i>
                        <form onSubmit={(e) => {handleSearch(e); setShowMsg(true);}}>
                            <input
                                value={search}
                                onChange={(e) => {setSearch(e.target.value); setShowMsg(false)}}
                                onBlur={(e) => {handleSearch(); setShowMsg(true);}}
                                type="text"
                                className="form-control border-0 shadow-none"
                                placeholder="Tìm kiếm..."
                                aria-label="Tìm kiếm..."
                            />
                        </form>
                    </div>
                </div>

                {listCredit?.length == 0 && showMsg ?
                    <div className={styles.empty}>
                        <h3>{search ? 'Không tìm thấy kết quả' : 'Thư mục này chưa có bộ thẻ nào'}</h3>
                        
                        {(search || userData?.username != folder.createdBy) ? null : <div className='d-flex justify-content-center'>
                            <Fab onClick={() => setOpen(true)} sx={{ ...fabGreenStyle } as SxProps} color="inherit" variant="extended">
                                <AddIcon sx={{ mr: 1 }} />
                                Thêm bộ thẻ
                            </Fab>
                        </div>}
                    </div>
                    : null}

                {/* Dialog add */}
                <BootstrapDialog
                    onClose={() => setOpen(false)}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                    maxWidth={'sm'}
                    fullWidth={true}
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        Thêm bộ thẻ
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

                            {listCreditAll.map((credit, index) => {
                                let checked = listCredit.some((item) => item.creditId == credit.creditId)
                                return (
                                    <div key={credit.creditId}>
                                        <BoxCreditInModal data={credit} callBackCheck={handleCheckInModal} checked={checked}/>
                                    </div>)
                            })}
                        </div>

                        <nav aria-label="Page navigation">
                            <ul className="pagination justify-content-center mt-4">
                                <li className="page-item prev">
                                    <a onClick={() => handleNextPage(-1)} className={`page-link fw-semibold ${styles.arrow} ${pageIndexAll > 1 ? styles.active : null}`}>
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
                                    <a onClick={() => handleNextPage(1)} className={`page-link fw-semibold ${styles.arrow} ${pageIndexAll < totalPageAll ? styles.active : null}`}>
                                        <span>Tiếp</span>
                                        <i className="tf-icon bx bx-chevron-right"></i>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </DialogContent>


                    <DialogActions>
                        <button type="button" className={`btn btn-primary`} onClick={() => handleSubmit()}>
                            Lưu
                        </button>
                        {/* <Button autoFocus >
                            Lưu
                        </Button> */}
                    </DialogActions>
                </BootstrapDialog>


                <div className="row">
                    {listCredit.map((credit, index) => {

                        return (
                            <div className="col-6" key={credit.creditId}>

                                <BoxCredit credit={credit} />
                                {/* <BoxCreditAccount credit={credit} /> */}
                            </div>)
                    })}
                </div>

            </div>
        </>
    )
};
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Loading from "~/components/Loading/Index";
import { useAppDispatch, useAppSelector } from "~/redux/hook";
import { changeAvt, inforUser, logout } from "~/redux/slices/authSlice";
import styles from './Setting.module.scss';
import Button from "@mui/material/Button";
import CreateIcon from '@mui/icons-material/Create';
import { Checkbox, InputAdornment, TextField } from "@mui/material";
import { BootstrapDialog, fabGreenStyle } from "~/components/Common";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { BASE_URL_MEDIA, Get, Post } from "~/services/axios";
import { CheckResponseSuccess } from "~/utils/common";
import { store } from "~/redux/store";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const INIT_VALUE = {
    oldPass: "",
    newPass: "",
    renewPass: ""
}

export default function Setting() {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [isSendRecall, setIsSendRecall] = useState(false);
    const [isSendLearn, setIsSendLearn] = useState(false);
    const [isSendClass, setIsSendClass] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userData = useAppSelector(inforUser);

    useEffect(() => {
        getNotiState();
    }, [])

    const validFileExtensions:any = { image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'] };
    
    function isValidFileType(fileList:any, fileType:any) {
        if(!fileList?.length) return true;
        let file = fileList[0];
        let fileName = file?.name.toLowerCase();
        return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
    }

    const handleSelectImg = (e:any) => {
        if (!e.target.files || e.target.files.length === 0) {
            // setSelectedFile(undefined)
            return
        }
        if (!isValidFileType(e.target.files, 'image')) {
            toast.error('Định dạng file không hợp lệ');
            return;
        }

        // handle Upload file 
        fetchAPICreate(e.target.files[0])
    }

    const fetchAPICreate = async (data:any) => {
        const formData = new FormData();
        formData.append('avatar', data)
        await Post(
            "/api/Account/upload-avatar", 
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        ).then(async (res) => {
            if(CheckResponseSuccess(res)) {
                let imageFile = res?.returnObj;
                let user_data:IUser = {...userData, avatar: imageFile}
                store.dispatch(changeAvt({userData: user_data}));
                toast.success('Cập nhật ảnh đại diện thành công');
                // Swal.fire({
                //     icon: "success",
                //     title: "Update thành công",
                //     showConfirmButton: false,
                //     timer: 600,
                //   });
                // navigate(`/credit/${creditId}`);
            }
            else {
                toast.error("Đã có lỗi xảy ra.");
            }
        })
        .catch((err) => {
            toast.error("Đã có lỗi xảy ra.");
            console.log(err);
        })
    }

    const getNotiState = async () => {
        setIsLoading(true);
        await Get(
            "/api/Account/get-noti-state-data", 
            {}, 
        ).then(async (res) => {
            if(CheckResponseSuccess(res)) {
                setIsSendClass(res.returnObj?.sendClass);
                setIsSendRecall(res.returnObj?.sendRecall)
                setIsSendLearn(res.returnObj?.sendLearn)
            }
            else {
                toast.error("Đã có lỗi xảy ra.");
            }
        })
        .catch((err) => {
            toast.error("Đã có lỗi xảy ra.");
            console.log(err);
        });

        setIsLoading(false)
    }

    const fetchAPIUpdateNotiState = async () => {
        setIsLoading(true);
        await Post(
            "/api/Account/update-noti-state-data", 
            {
                sendLearn: isSendLearn,
                sendClass: isSendClass,
                sendRecall: isSendRecall
            },
        ).then(async (res) => {
            if(CheckResponseSuccess(res)) {
                Swal.fire({
                    icon: "success",
                    title: "Cập nhật thành công",
                    showConfirmButton: false,
                    timer: 600,
                  });

                // await getNotiState();
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

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowRePassword = () => setShowRePassword((show) => !show);
    const handleClickShowOldPassword = () => setShowOldPassword((show) => !show);
    
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    
    const validationSchema = Yup.object().shape({
        oldPass: Yup.string().required('Hãy nhập mật khẩu cũ'),
        newPass: Yup.string().required('Hãy nhập mật khẩu mới')
                     .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Mật khẩu phải bao gồm ít nhất một kí tự số, kí tự viết hoa, kí tự đặc biệt và có độ dài ít nhất 8 kí tự'),
        renewPass: Yup.string().required('Hãy nhập lại mật khẩu mới')
                     .oneOf([Yup.ref('newPass')], 'Mật khẩu không trùng khớp')
    });

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        getValues,
        setValue,
        setError,
        formState: { errors }
      } = useForm({
        // defaultValues: INIT_VALUE,
        resolver: yupResolver(validationSchema)
      });

    const onSubmit = async (data:any) => {
        setIsLoading(true);

        console.log(data);

        await Post(
            "/api/Auth/user-change-password", 
            {
                oldPassword: data.oldPass,
                newPassword: data.newPass
            },
        ).then(async (res) => {
            if(CheckResponseSuccess(res)) {
                Swal.fire({
                    icon: "success",
                    title: "Đổi mật khẩu thành công",
                    showConfirmButton: false,
                    timer: 600,
                  });
                dispatch(logout())
                navigate(`/login`);
            }
            else {
                setError("oldPass", { type: "custom", message: res.msg });
            }
        })
        .catch((err) => {
            toast.error("Đã có lỗi xảy ra.");
            console.log(err);
        })

        setIsLoading(false);
        
      };

    return (<>
        <Loading isLoading={isLoading} />
        <ToastContainer />
        <div className={`${styles.container}`}>
            <h3 className={styles.title}>
                Cài đặt
            </h3>

            <div className={styles.content}>

                <div className={styles.group}>
                    <div className={styles.box}>
                        <div className={styles.title}>Thông tin cá nhân</div>
                        
                        <div className={styles.box_item}>
                            <div className={styles.avatar}>
                                <img className={`${styles.img} w-px-75 h-px-75 rounded-circle`} src={BASE_URL_MEDIA + "/" + userData?.avatar} alt="" />
                                <div className={styles.label}>
                                    Ảnh đại diện
                                    <label htmlFor="avatar">
                                        <div className={styles.button_avatar}>
                                            Đổi ảnh đại diện 
                                            <CreateIcon style={{fontSize: "16px", marginLeft: '5px'}}/>
                                        </div>
                                        {/* <Button size="small" endIcon={<CreateIcon  />} variant="outlined">Đổi ảnh đại diện</Button> */}
                                    </label>
                                    <div style={{display: "none"}}>
                                        <TextField
                                            required
                                            id="avatar"
                                            type="file"
                                            // accept="image/*"
                                            inputProps={{ accept: 'image/*' }}
                                            onChange={handleSelectImg}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.box_item}>
                            <div className={styles.item}>
                                <div className={styles.label}>
                                    Tên tài khoản
                                </div>
                                <div className={styles.data}>
                                    {userData?.username}
                                </div>
                            </div>
                        </div>

                        <div className={styles.box_item}>
                            <div className={styles.item}>
                                <div className={styles.label}>
                                    Email
                                </div>
                                <div className={styles.data}>
                                    {userData?.email}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>


                <div className={styles.group}>
                    <div className={styles.box}>
                        <div className={styles.title}>
                            Thông báo
                        </div>
                        
                        <div className={styles.box_item}>
                            {/* <div>Các thông báo của bạn sẽ được cập nhật trên hệ thống</div> */}
                            <div className={styles.item}>
                                <div className={styles.label}>
                                    Gửi thông báo cho tôi qua email
                                </div>
                                <div className={styles.check_data} onClick={() => setIsSendRecall(!isSendRecall)}>
                                    <Checkbox
                                        checked={isSendRecall}
                                        onChange={() => setIsSendRecall(!isSendRecall)}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                    Thông báo ôn tập kiến thức
                                </div>
                                <div className={styles.check_data} onClick={() => setIsSendLearn(!isSendLearn)}>
                                    <Checkbox
                                        checked={isSendLearn}
                                        onChange={() => setIsSendLearn(!isSendLearn)}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                    Thông báo luyện tập hàng ngày
                                </div>
                                <div className={styles.check_data} onClick={() => setIsSendClass(!isSendClass)}>
                                    <Checkbox
                                        checked={isSendClass}
                                        onChange={() => setIsSendClass(!isSendClass)}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                    Thông báo về lớp học của tôi
                                </div>
                                <div className={styles.end_btn}>
                                    <button type="button" className={`btn btn-primary`} onClick={() => fetchAPIUpdateNotiState()}>Lưu</button>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                <div className={styles.group}>
                    <div className={styles.box}>
                        <div className={styles.title}>Tài khoản và mật khẩu</div>
                        
                        
                        <div className={styles.box_item}>
                            <div className={styles.item}>
                                <div className={styles.change_pass} onClick={() => setOpen(true)}>
                                    Đổi mật khẩu
                                </div>
                                <div className={styles.data}>
                                    {/* Thay đổi mật khẩu của bạn */}
                                </div>
                            </div>
                        </div>
                        <BootstrapDialog
                            onClose={() => {setOpen(false); reset();}}
                            aria-labelledby="customized-dialog-title"
                            open={open}
                            maxWidth={'sm'}
                            fullWidth={true}
                        >
                            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                                Đổi mật khẩu
                            </DialogTitle>
                            <IconButton
                                aria-label="close"
                                onClick={() => {setOpen(false); reset();}}
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
                                <div className={styles.modal_changepass}>
                                    <form id="formCreate" className="mb-3 mt-3" method="POST">

                                        {/* Input Credit */}
                                        <div className={styles.form_credit}>
                                            <TextField
                                                required
                                                id="oldPass"
                                                // name="loginName"
                                                label="Nhập mật khẩu của bạn"
                                                fullWidth
                                                margin="dense"
                                                variant="outlined" 
                                                // size="small"
                                                {...register('oldPass')}
                                                error={errors.oldPass ? true : false}
                                                helperText={errors.oldPass ? errors.oldPass?.message : ""}
                                                type={showOldPassword ? 'text' : 'password'}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowOldPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            <TextField
                                                required
                                                id="newPass"
                                                // name="loginName"
                                                label="Nhập mật khẩu mới"
                                                fullWidth
                                                margin="dense"
                                                variant="outlined" 
                                                // size="small"
                                                {...register('newPass')}
                                                error={errors.newPass ? true : false}
                                                helperText={errors.newPass ? errors.newPass?.message : ""}
                                                type={showPassword ? 'text' : 'password'}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            <TextField
                                                required
                                                id="renewPass"
                                                // name="loginName"
                                                label="Nhập lại mật khẩu mới"
                                                fullWidth
                                                margin="dense"
                                                variant="outlined" 
                                                // size="small"
                                                {...register('renewPass')}
                                                error={errors.renewPass ? true : false}
                                                helperText={errors.renewPass ? errors.renewPass?.message : ""}
                                                type={showRePassword ? 'text' : 'password'}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowRePassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                        {showRePassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </div>

                                    </form>
                                </div>
                            </DialogContent>


                            <DialogActions>
                                <button type="button" className={`btn btn-primary`} onClick={handleSubmit(onSubmit)}>
                                    Lưu
                                </button>
                            </DialogActions>
                        </BootstrapDialog>
                        {/* <div className={styles.box_item}>
                            <div className={styles.item}>
                                <div className={styles.label}>
                                    Quyền riêng tư
                                </div>
                                <div className={styles.data}>
                                    {userData?.username}
                                </div>
                            </div>
                        </div>

                        <div className={styles.box_item}>
                            <div className={styles.item}>
                                <div className={styles.label}>
                                    Xóa tài khoản của bạn
                                </div>
                                <div className={styles.data}>
                                    {userData?.email}
                                </div>
                            </div>
                        </div> */}
                    </div>

                </div>
            </div>
        </div>
    </>)
};

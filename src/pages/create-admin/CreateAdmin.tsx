import { yupResolver } from '@hookform/resolvers/yup';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import Loading from '~/components/Loading/Index';
import { Post } from "~/services/axios";
import { CheckResponseSuccess } from "~/utils/common";
import styles from './CreateAdmin.module.scss'

export default function CreateAdmin() {
    const navigate = useNavigate();
    
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowRePassword = () => setShowRePassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Hãy nhập tên tài khoản').matches(/^[a-zA-Z0-9_-]+$/, 'Tên tài khoản không được chứa kí tự đặc biệt và dấu cách'),
        email: Yup.string().required('Hãy nhập Email').email('Email không hợp lệ'),
        password: Yup.string().required('Hãy nhập mật khẩu')
                     .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Mật khẩu phải bao gồm ít nhất một kí tự số, kí tự viết hoa, kí tự đặc biệt và có độ dài ít nhất 8 kí tự'),
        passwordConfirm: Yup.string().required('Hãy nhập lại mật khẩu')
                     .oneOf([Yup.ref('password')], 'Mật khẩu không trùng khớp')
    });

    const {
        register,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: yupResolver(validationSchema) });

    const onSubmit = async (data:any) => {
        // dispatch(login(formLogin))
        setIsLoading(true);
        await Post(
            "/api/Auth/register-admin", 
            {
                username: data.username,
                email: data.email,
                passwordText: data.password
            }, 
            // ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                toast.success("Tạo thành khoản thành công!")
                // toast.success("Tài khoản của bạn đã được đăng ký thành công")
                Swal.fire({
                    icon: "success",
                    title: "Thực hiện thành công",
                    showConfirmButton: false,
                    timer: 800,
                });
                navigate('/manage')
                // setTimeout( () => 
                // , 3000)
            }
            else {
                toast.warn(res.msg)
            }
        })
        .catch((err) => {
            toast.error("Đã có lỗi xảy ra. Bạn vui lòng thử lại!");
            console.log(err);
        })
        setIsLoading(false);
    };


    return (
        <> 
            <Loading isLoading={isLoading}/>
            {/* <!-- Content --> */}
            <div className="">
                <div  className={`authentication-wrapper authentication-basic ${styles.container}`}>
                    <div className="authentication-inner">
                        {/* <!-- Register Card --> */}
                        <div className="card">
                            <div className="card-body">
                                
                                <form id="formAuthentication" className="mb-3" action="index.html" method="POST">
                                    <div className="mb-2">
                                        <TextField
                                            required
                                            id="username"
                                            // name="username"
                                            label="Tên tài khoản"
                                            fullWidth
                                            margin="dense"
                                            {...register('username')}
                                            error={errors.username ? true : false}
                                            helperText={errors.username ? errors.username?.message : ""}
                                        />


                                        {/* <label htmlFor="username" className="form-label">Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            name="username"
                                            placeholder="Enter your username"
                                            autoFocus
                                        /> */}
                                    </div>
                                    <div className="mb-2">
                                        <TextField
                                            required
                                            id="email"
                                            // name="email"
                                            label="Email"
                                            fullWidth
                                            margin="dense"
                                            {...register('email')}
                                            error={errors.email ? true : false}
                                            helperText={errors.email ? errors.email?.message : ""}
                                        />
                                        {/* <label htmlFor="email" className="form-label">Email</label>
                                        <input type="text" className="form-control" id="email" name="email" placeholder="Enter your email" /> */}
                                    </div>
                                    <div className="mb-2">
                                        <TextField
                                            required
                                            id="password"
                                            // name="password"
                                            label="Mật khẩu"
                                            type={showPassword ? 'text' : 'password'}
                                            fullWidth
                                            margin="dense"
                                            {...register('password')}
                                            error={errors.password ? true : false}
                                            helperText={errors.password ? errors.password?.message : ""}
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
                                        
                                        {/* <label className="form-label" htmlFor="password">Password</label>
                                        <div className="input-group input-group-merge">
                                            <input
                                                type="password"
                                                id="password"
                                                className="form-control"
                                                name="password"
                                                placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                                                aria-describedby="password"
                                            />
                                            <span  className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                                        </div> */}
                                    </div>

                                    <div className="mb-2">
                                        <TextField
                                            required
                                            id="passwordConfirm"
                                            // name="password"
                                            label="Nhập lại mật khẩu"
                                            type={showRePassword ? 'text' : 'password'}
                                            fullWidth
                                            margin="dense"
                                            {...register('passwordConfirm')}
                                            error={errors.passwordConfirm ? true : false}
                                            helperText={errors.passwordConfirm ? errors.passwordConfirm?.message : ""}
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

                                    <button  onClick={handleSubmit(onSubmit)} className="btn btn-primary d-grid w-100">Tạo mới</button>
                                </form>

                            </div>
                        </div>
                        {/* <!-- Register Card --> */}
                    </div>
                </div>
            </div>

            {/* <!-- / Content --> */}
            <ToastContainer />
        </>
    )
};

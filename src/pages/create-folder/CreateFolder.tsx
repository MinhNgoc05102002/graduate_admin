import { yupResolver } from '@hookform/resolvers/yup';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import Loading from '~/components/Loading/Index';
import { Post } from '~/services/axios';
import { CheckResponseSuccess } from '~/utils/common';
import NotFound from '../notfound/NotFound';
import styles from './CreateFolder.module.scss';

const INIT_VALUE = {
    name: "",
    description: ""
}


export default function CreateFolder() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const [isEdit, setIsEdit] = useState<boolean>(false);

    useEffect(() => {
        if(id) {
            getInfoFolder(id);
        }
    }, [id]);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Hãy nhập tên thư mục').max(100, 'Tên thư mục không được vượt quá 100 kí tự'),
        description: Yup.string().required('Hãy nhập mô tả của thư mục').max(2000, 'Mô tả không được vượt quá 2000 kí tự'),
    });

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        getValues,
        setValue,
        formState: { errors }
      } = useForm({
        defaultValues: INIT_VALUE,
        mode: "onChange",
        resolver: yupResolver(validationSchema)
      });

    const onSubmit = async (data:any) => {
        setIsLoading(true);

        await Post(
            "/api/Folder/create-folder", 
            data,
        ).then(async (res) => {
            if(CheckResponseSuccess(res)) {
                let creditId = res?.returnObj;
                Swal.fire({
                    icon: "success",
                    title: "Tạo thư mục thành công",
                    showConfirmButton: false,
                    timer: 600,
                  });
                navigate(`/folder/${creditId}`);
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

    const onUpdate = async (data:any) => {
        setIsLoading(true);

        await Post(
            "/api/Folder/edit-folder", 
            {
                ...data,
                folderId: id
            },
        ).then(async (res) => {
            if(CheckResponseSuccess(res)) {
                // let creditId = res?.returnObj;
                Swal.fire({
                    icon: "success",
                    title: "Cập nhật thư mục thành công",
                    showConfirmButton: false,
                    timer: 600,
                  });
                navigate(`/folder/${id}`);
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

    const getInfoFolder = async (folderId:string) => {
        setIsLoading(true);
        await Post(
            "/api/Folder/get-folder-by-id",
            {
                pageSize: 5,
                pageIndex: 0,
                containerId: folderId
            },
        ).then((res) => {
            if (CheckResponseSuccess(res)) {
                let folder = res?.returnObj;
                if (folder) {
                    setIsEdit(true);
                    setValue('description', folder.description);
                    setValue('name', folder.name);
                }
                else {
                    setIsEdit(false);
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

    if (id && isEdit == false) {
        return (
            <NotFound />
        )
    }
  
    return (
        <>
            <Loading isLoading={isLoading}/>
            <ToastContainer />

            <div className={`container-xxl flex-grow-1 container-p-y px-5`}>
                <div className={styles.title}>
                    <h4 className={styles.name}>
                        {isEdit ? 'Cập nhật thư mục' : 'Tạo thư mục mới'}
                    </h4>
                    <div className="d-flex justify-content-sm-end">
                        {isEdit ?
                            <button type="button" className="btn btn-primary" onClick={handleSubmit(onUpdate)}>Cập nhật</button> :
                            <button type="button" className="btn btn-primary" onClick={handleSubmit(onSubmit)}>Tạo mới</button>
                        }
                    </div> 
                </div>

                <form id="formCreate" className="mb-3 mt-3" method="POST">

                    {/* Input Credit */}
                    <div className="card p-2">

                        <div className={styles.form_credit}>
                            <TextField
                                required
                                id="name"
                                // name="loginName"
                                label="Nhập tên thư mục"
                                fullWidth
                                margin="dense"
                                variant="outlined" 
                                size="small"
                                {...register('name')}
                                error={errors.name ? true : false}
                                helperText={errors.name ? errors.name?.message : ""}
                            />

                            <TextField
                                required
                                id="loginName"
                                // name="loginName"
                                label="Thêm mô tả ..."
                                fullWidth
                                margin="dense"
                                variant="outlined" 
                                size="small"
                                multiline
                                maxRows={4}
                                minRows={3}
                                {...register('description')}
                                error={errors.description ? true : false}
                                helperText={errors.description ? errors.description?.message : ""}
                            />
                        </div>

                    </div>
  
                </form>
            </div>
        </>
    )
};

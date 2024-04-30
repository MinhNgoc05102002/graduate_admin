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
import styles from './CreateClass.module.scss';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const INIT_VALUE = {
    name: "",
    description: "",
    acceptEdit: false
}


export default function CreateClass() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const [isEdit, setIsEdit] = useState<boolean>(false);

    useEffect(() => {
        if(id) {
            getInfoClass(id);
        }
    }, [id]);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Hãy nhập tên lớp học').max(100, 'Tên lớp học không được vượt quá 100 kí tự'),
        description: Yup.string().required('Hãy nhập mô tả của lớp học').max(2000, 'Mô tả không được vượt quá 2000 kí tự'),
        acceptEdit: Yup.boolean()
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
    
      const watchCheck = watch('acceptEdit')

    const onSubmit = async (data:any) => {
        setIsLoading(true);

        console.log(data);

        await Post(
            "/api/Class/create-class", 
            data,
        ).then(async (res) => {
            if(CheckResponseSuccess(res)) {
                let classId = res?.returnObj;
                Swal.fire({
                    icon: "success",
                    title: "Tạo lớp học thành công",
                    showConfirmButton: false,
                    timer: 600,
                  });
                navigate(`/class/${classId}`);
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
            "/api/Class/edit-class", 
            {
                ...data,
                classId: id
            },
        ).then(async (res) => {
            if(CheckResponseSuccess(res)) {
                // let creditId = res?.returnObj;
                Swal.fire({
                    icon: "success",
                    title: "Cập nhật lớp học thành công",
                    showConfirmButton: false,
                    timer: 600,
                  });
                navigate(`/class/${id}`);
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

    const getInfoClass = async (classId:string) => {
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
            if (CheckResponseSuccess(res)) {
                let _class = res?.returnObj;
                if (_class) {
                    setIsEdit(true);
                    setValue('description', _class.description);
                    setValue('name', _class.name);
                    setValue('acceptEdit', _class.acceptEdit);
                    console.log(getValues('acceptEdit'), _class.acceptEdit)
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
                        {isEdit ? 'Cập nhật lớp học' : 'Tạo lớp học mới'}
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
                                label="Nhập tên lớp học"
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

                            <div className="input_checkbox">
                                <FormControlLabel
                                    label="Cho phép các thành viên trong lớp thêm và bỏ học phần, thư mục"
                                    control={
                                        <Checkbox
                                            checked={watchCheck}
                                            {...register('acceptEdit')}
                                        />
                                    }
                                />
                            </div>
                        </div>

                    </div>
  
                </form>
            </div>
        </>
    )
};

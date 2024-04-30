import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import * as Yup from 'yup';
import BoxCreateCard from '~/components/BoxCreateCard/BoxCreateCard';
import Loading from '~/components/Loading/Index';
import { BASE_URL_MEDIA, Post } from '~/services/axios';
import { CheckResponseSuccess } from '~/utils/common';
import styles from './CreateCredit.module.scss';
import Swal from 'sweetalert2'
import { yupResolver } from '@hookform/resolvers/yup';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NavigationIcon from '@mui/icons-material/Navigation';
import { green } from '@mui/material/colors';
import { SxProps } from '@mui/system';
import { fabGreenStyle } from '~/components/Common';
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { ICategory } from '~/types/ICategory';
import NotFound from '../notfound/NotFound';

const INIT_VALUE = {
    name: "",
    description: "",
    flashcardDTOs: [
        {
            flashcardId: null,
            question: "",
            answer: "",
            answerLang: "",
            questionLang: "",
            imageLink: "",
            imageFile: null,
        },
        {
            flashcardId: null,
            question: "",
            answer: "",
            answerLang: "",
            questionLang: "",
            imageLink: "",
            imageFile: null,
        },
        {
            flashcardId: null,
            question: "",
            answer: "",
            answerLang: "",
            questionLang: "",
            imageLink: "",
            imageFile: null,
        },
        {
            flashcardId: null,
            question: "",
            answer: "",
            answerLang: "",
            questionLang: "",
            imageLink: "",
            imageFile: null,
        },
        {
            flashcardId: null,
            question: "",
            answer: "",
            answerLang: "",
            questionLang: "",
            imageLink: "",
            imageFile: null,
        }
    ]
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function CreateCredit() {
    const userData = useAppSelector(inforUser);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [showNotFound, setShowNotFound] = useState(false);

    const { id } = useParams();
    const [personName, setPersonName] = useState<string[]>([]);
    const [listCategory, setListCategory] = useState<ICategory[]>([]);
    const [listCategorySelected, setListCategorySelected] = useState<string[]>([]);

    const validFileExtensions:any = { image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'] };

    function isValidFileType(fileList:any, fileType:any) {
        if(!fileList?.length) return true;
        let file = fileList[0];
        let fileName = file?.name.toLowerCase();
        return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Hãy nhập tên bộ thẻ').max(100, 'Tên bộ thẻ không được vượt quá 100 kí tự'),
        description: Yup.string().required('Hãy nhập mô tả của bộ thẻ').max(2000, 'Tên bộ thẻ không được vượt quá 2000 kí tự'),
        flashcardDTOs: Yup.array().of(
            Yup.object().shape({
                flashcardId: Yup.string().nullable('Allow null'),
                answer: Yup.string().required('Hãy nhập định nghĩa'),
                question: Yup.string().required('Hãy nhập thuật ngữ'),
                answerLang: Yup.string(),
                questionLang: Yup.string(),
                imageLink: Yup.string().nullable('Allow null'),
                imageFile: Yup.mixed().nullable('Allow null').test("is-valid-type", "Định dạng file không hợp lệ",
                (value:any) => isValidFileType(value , "image"))
              })
            ).min(1, `Bộ thẻ phải chứa ít nhất một thẻ flashcard`)
    });

    // const {
    //     register,
    //     control,
    //     handleSubmit,
    //     formState: { errors }
    // } = useForm({ resolver: yupResolver(validationSchema) });

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

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "flashcardDTOs", // unique name for your Field Array
    });

    useEffect(() => {
        getAllCategory();
    }, []);

    useEffect(() => {
        if (id) {
            getInfoCredit(id);
            getListFlashcard(id);
        }
    }, [id]);

    const getInfoCredit = (id:any) => {
        Post(
            "/api/Credit/get-credit-by-id", 
            id, 
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let credit = res?.returnObj;
                if (credit) {
                    setValue('name', credit.name, { shouldTouch: true });
                    setValue('description', credit.description, { shouldTouch: true });

                    let listCategoryId = credit.categories.map((cate:any) => cate.categoryId);
                    setListCategorySelected(listCategoryId);
                    // setCredit(credit);
                    // setIsLearned(credit.isLearned);
                }
                else {
                    setShowNotFound(true);
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
    }; 

    const getListFlashcard = async (id:any) => {
        let listFlashcards:any = [];
        await Post(
            "/api/Flashcard/get-flashcard-by-creditid", 
            {
                // username: userData?.username,
                // creditId: creditId
                pageSize: 1000,
                pageIndex: 0,
                username: userData?.username,
                containerId: id
            }, 
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let flashcards = res?.returnObj;
                if (flashcards) {
                    console.log(flashcards)
                    listFlashcards = flashcards;
                    // setListFlashcard(flashcards);
                    // setCurrentCard(flashcards[0]);
                    // setCurrentIndex(0)
                    let listFlashCardDTO = flashcards.map((card:any) => {
                        return {
                            flashcardId: card.flashcardId,
                            question: card.question,
                            answer: card.answer,
                            answerLang: card.answerLang,
                            questionLang: card.questionLang,
                            imageLink: card.image,
                            imageFile: null
                        }
                    })

                    setValue("flashcardDTOs", listFlashCardDTO, { shouldTouch: true });
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
        return listFlashcards;
    }; 

    const getAllCategory = async () => {
        setIsLoading(true);
        await Post(
            "/api/Category/get-all-active", 
            {
                // username: userData?.username,
                // creditId: creditId
                pageSize: 1000,
                pageIndex: 0
            }, 
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let categories = res?.returnObj?.listResult;
                setListCategory(categories);
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
  
    const handleChange = (event: SelectChangeEvent<typeof listCategorySelected>) => {
      const {
        target: { value },
      } = event;
      setListCategorySelected(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
    };


    console.log(errors)
    const onSubmit = async (data:any) => {
        console.log(data);
        
        setIsLoading(true);

        // await call api create
        let listFlashcard = data.flashcardDTOs.map((card:any) => {
            return {
                ...card, 
                imageFile: card?.imageFile ? card.imageFile?.[0] : null//demoFile
            }
        })

        data.flashcardDTOs = listFlashcard;
        const formData = new FormData();
        formData.append('creditReqDTO[name]', data.name);
        formData.append('creditReqDTO[description]', data.description);
        listCategorySelected.forEach((categoryId, index) => {
            formData.append(`creditReqDTO[categoryId][${index}]`, categoryId)
        })

        listFlashcard.forEach((card:any, index:number) => {
            formData.append(`creditReqDTO[flashcardDTOs][${index}][orderIndex]`, String(index))
            formData.append(`creditReqDTO[flashcardDTOs][${index}][flashcardId]`, card.flashcardId ?? '')
            formData.append(`creditReqDTO[flashcardDTOs][${index}][question]`, card.question)
            formData.append(`creditReqDTO[flashcardDTOs][${index}][answer]`, card.answer)
            formData.append(`creditReqDTO[flashcardDTOs][${index}][answerLang]`, card.answerLang)
            formData.append(`creditReqDTO[flashcardDTOs][${index}][questionLang]`, card.questionLang)
            formData.append(`creditReqDTO[flashcardDTOs][${index}][imageFile]`, card.imageFile)

            let hasImage = card?.imageFile ? 'Y' : 'N';
            formData.append(`creditReqDTO[flashcardDTOs][${index}][hasImage]`, hasImage)
            formData.append(`listFile`, card.imageFile)
        });
        
        if (id) {
            formData.append('creditReqDTO[creditId]', id);
            await fetchAPIEdit(formData);
        } 
        else {
            await fetchAPICreate(formData)
        }

        setIsLoading(false);
        
      };

    const fetchAPICreate = async (formData:any) => {
        await Post(
            "/api/Credit/create-credit", 
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        ).then(async (res) => {
            if(CheckResponseSuccess(res)) {
                let creditId = res?.returnObj;
                // toast.success('Tạo bộ thẻ thành công');
                Swal.fire({
                    icon: "success",
                    title: "Tạo bộ thẻ thành công",
                    showConfirmButton: false,
                    timer: 600,
                  });
                navigate(`/credit/${creditId}`);
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

    const fetchAPIEdit = async (formData:any) => {

        console.log(formData);
        await Post(
            "/api/Credit/edit-credit", 
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        ).then(async (res) => {
            if(CheckResponseSuccess(res)) {
                let creditId = res?.returnObj;
                // toast.success('Tạo bộ thẻ thành công');
                Swal.fire({
                    icon: "success",
                    title: "cập nhật bộ thẻ thành công",
                    showConfirmButton: false,
                    timer: 600,
                  });
                navigate(`/credit/${id}`);
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

    const handleAppend = () => {
        append({
            flashcardId: null,
            question: "",
            answer: "",
            answerLang: "",
            questionLang: "",
            imageLink: "",
            imageFile: null,
        });
    }


    if (showNotFound) {
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
            <ToastContainer />

            <div className={`container-xxl flex-grow-1 container-p-y px-5`}>
                <div className={styles.title}>
                    <h4 className={styles.name}>
                        Tạo bộ thẻ mới
                    </h4>
                    <button type="button" className="btn btn-primary" onClick={handleSubmit(onSubmit)}>Lưu</button>
                </div>

                <form id="formCreate" className="mb-3" method="POST">

                    {/* Input Credit */}
                    <div className="card p-2">

                        <div className={styles.form_credit}>
                            <TextField
                                required
                                id="name"
                                // name="loginName"
                                label="Nhập tên bộ thẻ"
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

                            <FormControl margin="dense" fullWidth>
                                <InputLabel id="demo-multiple-chip-label">Thể loại</InputLabel>
                                <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
                                    multiple
                                    value={listCategorySelected}
                                    onChange={handleChange}
                                    input={<OutlinedInput id="select-multiple-chip" label="Thể loại" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={listCategory.find(item => item.categoryId == value)?.name} />
                                            ))}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                >
                                    
                                    {listCategory.map((cate) => (
                                        <MenuItem key={cate.categoryId} value={cate.categoryId}>
                                            <Checkbox checked={!!listCategorySelected.find(item => item == cate.categoryId)} />
                                            <ListItemText primary={cate.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                    </div>
                    {errors.flashcardDTOs ? 
                    <div className={styles.list_error}>
                        <div style={{color: '#d32f2f', textAlign: 'center'}}>{errors.flashcardDTOs ? errors.flashcardDTOs?.message : ""}</div>
                        <div style={{color: '#d32f2f', textAlign: 'center'}}>{errors.flashcardDTOs?.root ? errors.flashcardDTOs?.root?.message : ""}</div>
                    </div> : null}


                    {/* Input FlashCard */}
                    <div className={styles.form_card}>
                        {fields.map((card, index) => {
                            return (
                                <BoxCreateCard 
                                    key={card.id} 
                                    item={card} 
                                    register={register}
                                    ordinal={index}
                                    getValues={getValues}
                                    setValue={setValue}
                                    errors={errors}
                                    remove={remove}
                                    previewInit={card?.imageLink ?? ""}
                                />
                            )
                        })}
                    </div>

                    {/* btn cộng thẻ  */}
                    <div className='d-flex justify-content-center'>
                        <Fab onClick={handleAppend} sx={{...fabGreenStyle } as SxProps} color="inherit" variant="extended">
                            <AddIcon sx={{ mr: 1 }} />
                            Thêm thẻ
                        </Fab>
                    </div>

                    <div className="d-flex justify-content-sm-end">
                        <button type="button" className="btn btn-primary" onClick={handleSubmit(onSubmit)}>Lưu</button>
                    </div>    
                </form>
            </div>
        </>
    )
};

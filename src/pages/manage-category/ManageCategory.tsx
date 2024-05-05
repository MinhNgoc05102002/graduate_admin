import React, { useEffect, useMemo, useState } from 'react';
import styles from './ManageCategory.module.scss'
import { DataGrid, GridToolbarQuickFilter, GridToolbarContainer, GridToolbarExport, GridToolbar, GridToolbarColumnsButton, GridActionsCellItem, GridColDef, GridValueGetter } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { Post } from '~/services/axios';
import { CheckResponseSuccess } from '~/utils/common';
import { ToastContainer, toast } from 'react-toastify';
import Loading, { PopupMenu } from '~/components/Loading/Index';
import { Button, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from "react-router-dom";
import { BootstrapDialog } from '~/components/Common';
import CloseIcon from '@mui/icons-material/Close';
import { ICredit } from '~/types/ICredit';
import Swal from 'sweetalert2';
import { ICategory } from '~/types/ICategory';

function CustomToolbar() {
  return (
    <GridToolbarContainer className={styles.toolbar_container}>
      <div className={styles.button}>
        <GridToolbarExport />
        <GridToolbarColumnsButton />
      </div>
      {/* <div className={styles.search}>
        <GridToolbarQuickFilter />
      </div> */}
    </GridToolbarContainer>
  );
}

const INIT_VALUE = {
  description: "",
  name: "",
  isDeleted: 0
}

export default function ManageCategory() {
  const [dataTable, setDataTable] = useState<ICategory[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listReport, setListReport] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<any>({
    categoryId: false,
  });
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 25,
    page: 0,
  });
  
  const validationSchema = Yup.object().shape({
        description: Yup.string(),
        name: Yup.string(),
        isDeleted: Yup.number()
  });

  const {
      register,
      control,
      handleSubmit,
      getValues,
      formState: { errors }
  } = useForm({ 
    defaultValues: INIT_VALUE,
    resolver: yupResolver(validationSchema) 
  });


  useEffect(() => {
    getCategoryData(INIT_VALUE);
  }, [])

  const getCategoryData = async (data:any) => {
    setLoading(true)
    await Post(
        "/api/Category/get-all",
        {
            description: data.description,
          name: data.name,
          isDeleted: data?.isDeleted ? data?.isDeleted == 1 ? true : false : null,
          pageSize: paginationModel.pageSize,
          pageIndex: paginationModel.page
        },
    ).then((res) => {
        if (CheckResponseSuccess(res)) {
            let data = res?.returnObj;
            if (data) {
                setDataTable(data.listResult)
                // { y: 18, label: "Direct" },
                let dataChart = []
                
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
    setLoading(false)
  }

  const handleDeleteCategory = async (data:any) => {
    console.log(data)
    let category:any = dataTable.find((item:any) => item.categoryId == data.id);

    setLoading(true)
    await Post(
        "/api/Category/delete-category",
        {
          categoryId: data.id,
          isDeleted: !category.isDeleted
        },
    ).then((res) => {
        if (CheckResponseSuccess(res)) {
            Swal.fire({
              icon: "success",
              title: "Cập nhật thành công",
              showConfirmButton: false,
              timer: 600,
          });
          let data = getValues();
          getCategoryData(data);
          
        }
        else {
            toast.error("Đã có lỗi xảy ra.");
        }
    })
        .catch((err) => {
            toast.error("Đã có lỗi xảy ra.");
            console.log(err);
        })
    setLoading(false)
  }

  const onSubmitSearch = (data:any) => {
    getCategoryData(data);
  }

  function getRowId(row: any) {
    return row.categoryId;
  }

  const columns: any = React.useMemo(() => [
    {
      field: 'categoryId',
      hide: true,
      width: 330,
      headerName: 'Mã thể loại',
      renderHeader: () => (<strong> Mã thể loại </strong>),
    },
    {
      field: 'name',
      headerName: 'Tên thể loại',
      width: 250,
      renderHeader: () => (<strong> Tên thể loại </strong>),
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      width: 500,
      renderHeader: () => (<strong> Mô tả </strong>),
    },
    {
      field: 'isDeleted',
      headerName: 'Trạng thái',
      width: 100,
      renderHeader: () => (<strong> Trạng thái </strong>),
      renderCell: (props:any) => {
        let {value} = props;
        return (
          <>
            {value == true ? 
            <div style={{fontWeight: '300'}}>Đã xóa</div>:
            <div>Hiệu lực</div>
            }
          </>
        )
      }
    },
    // {
    //   field: 'isLocked',
    //   headerName: 'Bị khóa?',
    //   width: 100,
    //   renderHeader: () => (<strong> Bị khóa? </strong>),
    //   renderCell: (props:any) => {
    //     let {value} = props;
    //     return (
    //       <>
    //         {value == true ? 
    //         <span className="bx bx-check" style={{color: '#d05700', fontSize: '24px', fontWeight:'bolder'}}></span>:
    //         <span className="bx bx-x" style={{color: '#18ae79', fontSize: '24px', fontWeight:'bolder'}}></span>
    //         }
    //       </>
    //     )
    //   }
    // },
    {
      field: 'actions',
      type: 'actions',
      width: 100,
      renderHeader: () => (<strong> Tùy chọn </strong>),
      getActions: (params:any) => [
        <PopupMenu 
          renderBtn={(handleClick:any) => (
              <span id="demo-positioned-button" onClick={handleClick} className='bx bx-dots-vertical-rounded' style={{fontSize: '20px', fontWeight:'bold'}}></span>
          )}
          renderItem={(handleClose:any) => {
            // let credit:any = dataTable.find((item:any) => item.creditId == params.id);
            // let disable = credit.isLocked
            return (
                <div>
                    <MenuItem  className="menu_item" onClick={() => navigate(`/category/${params.id}`)}>
                        <span className='bx bx-pencil icon'></span>
                        Chỉnh sửa
                    </MenuItem>
                    <MenuItem  onClick={() => {handleDeleteCategory(params); handleClose();}} className="menu_item">
                        <span className='bx bx-trash icon'></span>
                        Xóa/Khôi phục
                    </MenuItem>
                </div>
            )}}
      />
      ],
    },
  ], [handleDeleteCategory]);

  return (<>
    <ToastContainer />
    <Loading isLoading={loading}/>
    <div className={styles.post}>
      <div className={styles.box_container}>
        <div className={styles.title}>Danh sách thể loại</div>

        <div className={styles.search_container}>
          <form id="formAuthentication" className="mb-3 row" action="index.html" method="POST">
              {/* <div className="col-1"></div> */}
              <div className="col-3">
                  <TextField
                      // required
                      id="name"
                      // name="name"
                      label="Tên thể loại"
                      fullWidth
                      margin="dense"
                      size='small'
                      {...register('name')}
                      error={errors.name ? true : false}
                      helperText={errors.name ? errors.name?.message : ""}
                  />
                </div>
                {/* <div className="col-1"></div> */}
                <div className="col-3">
                  <TextField
                      id="description"
                      label="Mô tả"
                      fullWidth
                      size='small'
                      margin="dense"
                      {...register('description')}
                      error={errors.description ? true : false}
                      helperText={errors.description ? errors.description?.message : ""}
                  />
              </div>
              <div className="col-3">
                <FormControl fullWidth size='small' margin='dense'>
                  <InputLabel  id="demo-simple-select-label">Trạng thái</InputLabel>
                  <Controller
                      control={control}
                      {...register('isDeleted')}
                      render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            {...field}
                          >
                            <MenuItem value={0}>Tất cả</MenuItem>
                            <MenuItem value={1}>Đã xóa</MenuItem>
                            <MenuItem value={2}>Hiệu lực</MenuItem>
                          </Select>
                      )}
                  />
                </FormControl>
              </div>
              {/* <div className="col-1"></div> */}
              <div className="col-3">
                <button className='btn btn-primary mt-2 mx-2' onClick={handleSubmit(onSubmitSearch)}>Tìm kiếm</button>
                <button className='btn btn-info mt-2 mx-2' onClick={() => navigate(`/category`)}>Thêm mới</button>
              </div>
          </form>
        </div>

        <div className={styles.table_container}>
          <DataGrid
            // {...data}
            columns={columns}
            rows={dataTable}
            loading={loading}
            slots={{
              toolbar: CustomToolbar,
            }}
            disableRowSelectionOnClick 
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) =>
              setColumnVisibilityModel(newModel)
            }
            getRowId={getRowId}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </div>

      </div>

    </div>
  </>)
};

import React, { useEffect, useMemo, useState } from 'react';
import styles from './Manage.module.scss'
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
import { useAppSelector } from '~/redux/hook';
import { inforUser } from '~/redux/slices/authSlice';

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
    username: "",
    email: "",
    status: "",
}

export default function Manage() {
  const [dataTable, setDataTable] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listReport, setListReport] = useState<any>([]);
  const userData = useAppSelector(inforUser);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<any>({
    // content: false,
    // creditId: false,
    // is_deleted: false,
    // createdAt: false,
  });
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 25,
    page: 0,
  });
  
  const validationSchema = Yup.object().shape({
        username: Yup.string(),
        email: Yup.string(),
        status: Yup.string()
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
    getReportedData(INIT_VALUE);
  }, [])

  const getReportedData = async (data:any) => {
    setLoading(true)
    await Post(
        "/api/Account/get-admin-account",
        {
            username: data.username,
            email: data.email,
            status: data.status,
            pageSize: paginationModel.pageSize,
            pageIndex: paginationModel.page
        },
    ).then((res) => {
        if (CheckResponseSuccess(res)) {
            let data = res?.returnObj;
            if (data) {
                setDataTable(data.listResult)
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

  const handleChangeRole = async (username:string, newRole:string) => {
    setLoading(true)
    await Post(
        "/api/Account/change-role-account-admin",
        {
          username: username,
          email: '',
          role: newRole
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
          getReportedData(data);
          
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

  const handleLockAccount = async (data:any) => {
    let account:any = dataTable.find((acc:any) => acc.username == data.id)
    setLoading(true)
    await Post(
        "/api/Account/lock-account-admin",
        {
            username: data.id,
            email: '',
            status: account.status == "AUTH" ? "LOCK" : "AUTH"
        },
    ).then((res) => {
        if (CheckResponseSuccess(res)) {
            Swal.fire({
              icon: "success",
              title: "Thực hiện thành công",
              showConfirmButton: false,
              timer: 800,
          });
          let data = getValues();
          getReportedData(data);
          
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
    getReportedData(data);
  }

  function getRowId(row: any) {
    return row.username;
  }

  const showDateTime: GridValueGetter<any, unknown> = (
    value,
    row,
  ) => {
    return `${new Date(row.createdAt).getDate()}/${new Date(row.createdAt).getMonth()}/${new Date(row.createdAt).getFullYear()}`;
  };

  const columns: any = React.useMemo(() => [
    {
      field: 'username',
      hide: true,
      width: 220,
      headerName: 'Tên người dùng',
      renderHeader: () => (<strong> Tên người dùng </strong>),
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 220,
      renderHeader: () => (<strong> Email </strong>),
    },
    {
      field: 'createdAt',
      headerName: 'Ngày tạo',
      type: 'Date',
      width: 120,
      renderHeader: () => (<strong> Ngày tạo </strong>),
      valueGetter: showDateTime,
    },
    {
      field: 'roleAdmin',
      headerName: 'Vai trò',
      width: 150,
      renderHeader: () => (<strong> Vai trò </strong>),
      renderCell: (props:any) => {
        let {value} = props;
        return (
          <>
            {value == 'ADMIN' ? 
            <div style={{fontWeight: '300'}}>Người kiểm duyệt</div>:
            <div>Quản trị viên</div>
            }
          </>
        )
      }
    },
    {
      field: 'status',
      headerName: 'Bị khóa?',
      width: 100,
      renderHeader: () => (<strong> Bị khóa? </strong>),
      renderCell: (props:any) => {
        let {value} = props;
        return (
          <>
            {value == 'LOCK' ? 
            <span className="bx bx-check" style={{color: '#d05700', fontSize: '24px', fontWeight:'bolder'}}></span>:
            <span className="bx bx-x" style={{color: '#18ae79', fontSize: '24px', fontWeight:'bolder'}}></span>
            }
          </>
        )
      }
    },
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
            let account:any = dataTable.find((item:any) => item.username == params.id);
            // let disable = credit.isLocked
            return (
              <div>
                    {account.roleAdmin == "ADMIN" ?
                        <MenuItem disabled={userData?.roleAdmin == "ADMIN" || userData?.username == params.id} onClick={() => {handleChangeRole(params.id, 'CEO'); handleClose();}} className="menu_item">
                            <span className='bx bx-message-square-error icon'></span>
                            Chuyển thành Quản trị viên
                        </MenuItem>
                        : 
                        <MenuItem disabled={userData?.roleAdmin == "ADMIN" || userData?.username == params.id} onClick={() => {handleChangeRole(params.id, "ADMIN"); handleClose();}} className="menu_item">
                            <span className='bx bx-message-square-error icon'></span>
                            Chuyển thành người kiểm duyệt
                        </MenuItem>
                    }
                  <MenuItem disabled={userData?.roleAdmin == "ADMIN" || userData?.username == params.id} onClick={() => {handleLockAccount(params); handleClose();}} className="menu_item">
                      <span className='bx bx-lock-alt icon'></span>
                      Khóa/Mở khóa tài khoản
                  </MenuItem>
              </div>
          )}}
      />
      ],
    },
  ], [handleChangeRole, handleLockAccount]);

  return (<>
    <ToastContainer />
    <Loading isLoading={loading}/>
    <div className={styles.post}>
      <div className={styles.box_container}>
        <div className={styles.title}>Danh sách tài khoản hệ thống quản trị</div>

        <div className={styles.search_container}>
          <form id="formAuthentication" className="mb-3 row" action="index.html" method="POST">
              {/* <div className="col-1"></div> */}
              <div className="col-3">
                  <TextField
                      // required
                      id="username"
                      // name="username"
                      label="Tên người dùng"
                      fullWidth
                      margin="dense"
                      size='small'
                      {...register('username')}
                      error={errors.username ? true : false}
                      helperText={errors.username ? errors.username?.message : ""}
                  />
                </div>
                {/* <div className="col-1"></div> */}
                <div className="col-3">
                  <TextField
                      id="email"
                      // email="email"
                      label="Email"
                      fullWidth
                      size='small'
                      margin="dense"
                      {...register('email')}
                      error={errors.email ? true : false}
                      helperText={errors.email ? errors.email?.message : ""}
                  />
              </div>
              {/* <div className="col-1"></div> */}
              <div className="col-3">
                <FormControl fullWidth size='small' margin='dense'>
                  <InputLabel  id="demo-simple-select-label">Trạng thái</InputLabel>
                  <Controller
                      control={control}
                      {...register('status')}
                      render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            {...field}
                          >
                            <MenuItem value={''}>Tất cả</MenuItem>
                            <MenuItem value={'LOCK'}>Bị khóa</MenuItem>
                            <MenuItem value={'AUTH'}>Hiệu lực</MenuItem>
                          </Select>
                      )}
                  />
                </FormControl>
              </div>
              {/* <div className="col-1"></div> */}
              <div className="col-3">
                <button className='btn btn-primary mt-2 mx-2' onClick={handleSubmit(onSubmitSearch)}>Tìm kiếm</button>
                <button className='btn btn-info mt-2 mx-2' onClick={() => navigate(`/create-admin`)}>Thêm mới</button>
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

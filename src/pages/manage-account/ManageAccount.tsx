import React, { useEffect, useMemo, useState } from 'react';
import styles from './ManageAccount.module.scss'
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

export default function ManageAccount() {
  const [dataTable, setDataTable] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listReport, setListReport] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [dataOvalChart, setDataOvalChart] = useState(false);
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
    console.log(paginationModel)
    await Post(
        "/api/Account/get-reported-account",
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

  const getReportedInfoByCreditId = async (creditId:any) => {
    setLoading(true)
    await Post(
        "/api/Account/get-report-info-by-creditid",
        {
          createdBy: "",
          name: "",
          pageSize: 1000,
          pageIndex: 0,
          creditId: creditId
        },
    ).then((res) => {
        if (CheckResponseSuccess(res)) {
            let report = res?.returnObj;
            if (report) {
              setListReport(report.listReported.listResult)
              let dataChart = report.dataChart.map((data:any) => ({
                label: data.label,
                y: ((data.value / report.listReported.listResult.length)*100).toFixed(2),
              }))
              setDataOvalChart(dataChart)
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

  const handleSendWarning = async (data:any) => {
    setLoading(true)
    await Post(
        "/api/Account/send-warning",
        {
          notiType: "ADMIN_WARN",
          link: '',
          username: data.id,
          ortherInfo: '',
          senderInfo: ""
        },
    ).then((res) => {
        if (CheckResponseSuccess(res)) {
            Swal.fire({
              icon: "success",
              title: "Gửi cảnh báo thành công",
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

  const handleLockCredit = async (data:any) => {
    let account:any = dataTable.find((acc:any) => acc.username == data.id)
    setLoading(true)
    await Post(
        "/api/Account/lock-account",
        {
          notiType: "ADMIN_LOCK_ACCOUNT",
          link: '',
          username: data.id,
          ortherInfo: "",
          senderInfo: "",
          isLocked: account.status == "AUTH" ? true : false
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

  const optionsChart = {
    exportEnabled: true,
    animationEnabled: true,
    theme: "light1",  
    creditText: "",
    creditHref: "",
    // legend: {
    //     horizontalAlign: "right", // "center" , "right"
    //     verticalAlign: "center",  // "top" , "bottom"
    //     fontSize: 15,
    //     itemWidth: 250,
    //     dockInsidePlotArea: true 
    // },
    // backgroundColor: 'transparent',
    // subtitles: [{
    //     text: 'hêhê',
    //     verticalAlign: "center",
    //     fontSize: 15,
    //     fontWeight: "bold",
    //     fontFamily: '"Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    //     dockInsidePlotArea: true
    // }],
    // width: 220,
    // height: 220,
    data: [{
        // type: "doughnut",
        type: "pie",
        startAngle: 0,
        toolTipContent: "<b>{label}</b>: {y}%",
        showInLegend: "true",
        legendText: "{label}",
        indexLabelFontSize: 14,
        indexLabel: "{label} - {y}%",
        dataPoints: dataOvalChart
    }]
}

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
      field: 'countReport',
      headerName: 'Lượt báo cáo',
      width: 120,
      renderHeader: () => (<strong> Lượt báo cáo </strong>),
    },
    {
      field: 'hasWarning',
      headerName: 'Đã gửi cảnh báo (lần)',
      width: 170,
      renderHeader: () => (<strong> Đã gửi cảnh báo (lần) </strong>),
    },
    // {
    //   field: 'status',
    //   headerName: 'Trạng thái',
    //   width: 100,
    //   renderHeader: () => (<strong> Trạng thái </strong>),
    //   renderCell: (props:any) => {
    //     let {value} = props;
    //     return (
    //       <>
    //         {value == 'AUTH' ? 
    //         <div style={{fontWeight: '300'}}>Đang hiệu lực</div>:
    //         <div>Đã khóa</div>
    //         }
    //       </>
    //     )
    //   }
    // },
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
            // let credit:any = dataTable.find((item:any) => item.creditId == params.id);
            // let disable = credit.isLocked
            return (
              <div>
                  <MenuItem /*disabled={disable}*/ className="menu_item" onClick={() => navigate(`/account/${params.id}`)}>
                      <span className='bx bx-zoom-in icon'></span>
                      Xem chi tiết
                  </MenuItem>
                  
                  <MenuItem /*disabled={disable}*/ onClick={() => {handleSendWarning(params); handleClose();}} className="menu_item">
                      <span className='bx bx-message-square-error icon'></span>
                      Gửi cảnh cáo
                  </MenuItem>
                  <MenuItem onClick={() => {handleLockCredit(params); handleClose();}} className="menu_item">
                      <span className='bx bx-lock-alt icon'></span>
                      Khóa/Mở khóa tài khoản
                  </MenuItem>
              </div>
          )}}
      />
      ],
    },
  ], [handleSendWarning, handleLockCredit, getReportedInfoByCreditId]);

  return (<>
    <ToastContainer />
    <Loading isLoading={loading}/>
    <div className={styles.post}>
      <div className={styles.box_container}>
        <div className={styles.title}>Danh sách tài khoản bị báo cáo</div>

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
              <div className="col-1"></div>
              <div className="col-2">
                <button className='btn btn-primary mt-2' onClick={handleSubmit(onSubmitSearch)}>Tìm kiếm</button>
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

        <BootstrapDialog
            onClose={() => {setOpen(false);}}
            aria-labelledby="customized-dialog-title"
            open={open}
            maxWidth={'sm'}
            fullWidth={true}
        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Thông tin báo cáo
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={() => {setOpen(false);}}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>

            {/* <DialogActions>
                <button type="button" className={`btn btn-primary`} onClick={() => setOpen(false)}>
                    Đóng
                </button>
            </DialogActions> */}
        </BootstrapDialog>
      </div>

    </div>
  </>)
};

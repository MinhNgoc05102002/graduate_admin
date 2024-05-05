import CanvasJSReact from '@canvasjs/react-charts';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './ManageCredit.module.scss'
import { DataGrid, GridToolbarQuickFilter, GridToolbarContainer, GridToolbarExport, GridToolbar, GridToolbarColumnsButton, GridActionsCellItem, GridColDef, GridValueGetter } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { BASE_URL_MEDIA, Post } from '~/services/axios';
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

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

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
  createdBy: "",
  name: "",
  isLocked: 0
}

export default function ManageCredit() {
  const [dataTable, setDataTable] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listReport, setListReport] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [dataOvalChart, setDataOvalChart] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<any>({
    content: false,
    creditId: false,
    is_deleted: false,
    createdAt: false,
  });
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 25,
    page: 0,
  });
  
  const validationSchema = Yup.object().shape({
      createdBy: Yup.string(),
      name: Yup.string(),
      isLocked: Yup.number()
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
        "/api/Account/get-reported-credit",
        {
          createdBy: data.createdBy,
          name: data.name,
          isLocked: data?.isLocked ? data?.isLocked == 1 ? true : false : null,
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
    console.log(data)
    let credit:any = dataTable.find((item:any) => item.creditId == data.id);

    setLoading(true)
    await Post(
        "/api/Account/send-warning",
        {
          notiType: "ADMIN_WARN_CREDIT",
          link: data.id,
          username: credit.createdBy,
          ortherInfo: credit.name,
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

    let credit:any = dataTable.find((item:any) => item.creditId == data.id);
    setLoading(true)
    await Post(
        "/api/Account/lock-credit",
        {
          notiType: "ADMIN_LOCK_CREDIT",
          link: data.id,
          username: credit.createdBy,
          ortherInfo: "",
          senderInfo: credit.name,
          isLocked: !credit.isLocked
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
    return row.creditId;
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
      field: 'creditId',
      hide: true,
      width: 330,
      headerName: 'Mã bộ thẻ',
      renderHeader: () => (<strong> Mã bộ thẻ </strong>),
    },
    {
      field: 'createdBy',
      headerName: 'Người tạo',
      width: 160,
      renderHeader: () => (<strong> Người tạo </strong>),
    },
    {
      field: 'createdAt',
      headerName: 'Ngày tạo',
      type: 'Date',
      width: 100,
      renderHeader: () => (<strong> Ngày tạo </strong>),
      valueGetter: showDateTime,
    },
    {
      field: 'name',
      headerName: 'Tên bộ thẻ',
      width: 250,
      renderHeader: () => (<strong> Tên bộ thẻ </strong>),
    },
    {
      field: 'countLearn',
      headerName: 'Số người dùng',
      width: 125,
      renderHeader: () => (<strong> Số người dùng </strong>),
    },
    {
      field: 'countReport',
      headerName: 'Lượt báo cáo',
      width: 120,
      renderHeader: () => (<strong> Lượt báo cáo </strong>),
    },
    {
      field: 'countWarning',
      headerName: 'Đã gửi cảnh báo (lần)',
      width: 165,
      renderHeader: () => (<strong> Đã gửi cảnh báo (lần) </strong>),
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
            {!value == true ? 
            <div style={{fontWeight: '300'}}>Đã xóa</div>:
            <div></div>
            }
          </>
        )
      }
    },
    {
      field: 'isLocked',
      headerName: 'Bị khóa?',
      width: 100,
      renderHeader: () => (<strong> Bị khóa? </strong>),
      renderCell: (props:any) => {
        let {value} = props;
        return (
          <>
            {value == true ? 
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
            let credit:any = dataTable.find((item:any) => item.creditId == params.id);
            let disable = credit.isLocked
            return (
              <div>
                  <MenuItem disabled={disable} className="menu_item" onClick={() => navigate(`/credit/${params.id}`)}>
                      <span className='bx bx-zoom-in icon'></span>
                      Xem chi tiết
                  </MenuItem>
                  <MenuItem disabled={disable} className="menu_item" onClick={() => {handleClose(); getReportedInfoByCreditId(params.id); setOpen(true)}}>
                      <span className='bx bx-copy-alt icon'></span>
                      Xem thông tin báo cáo
                  </MenuItem>
                  <MenuItem disabled={disable} onClick={() => {handleSendWarning(params); handleClose();}} className="menu_item">
                      <span className='bx bx-message-square-error icon'></span>
                      Gửi cảnh cáo
                  </MenuItem>
                  <MenuItem onClick={() => {handleLockCredit(params); handleClose();}} className="menu_item">
                      <span className='bx bx-lock-alt icon'></span>
                      Khóa/Mở khóa bộ thẻ
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
        <div className={styles.title}>Danh sách bộ thẻ bị báo cáo</div>

        <div className={styles.search_container}>
          <form id="formAuthentication" className="mb-3 row" action="index.html" method="POST">
              {/* <div className="col-1"></div> */}
              <div className="col-3">
                  <TextField
                      // required
                      id="createdBy"
                      // name="createdBy"
                      label="Người tạo"
                      fullWidth
                      margin="dense"
                      size='small'
                      {...register('createdBy')}
                      error={errors.createdBy ? true : false}
                      helperText={errors.createdBy ? errors.createdBy?.message : ""}
                  />
                </div>
                {/* <div className="col-1"></div> */}
                <div className="col-3">
                  <TextField
                      id="name"
                      // name="name"
                      label="Tên bộ thẻ"
                      fullWidth
                      size='small'
                      margin="dense"
                      {...register('name')}
                      error={errors.name ? true : false}
                      helperText={errors.name ? errors.name?.message : ""}
                  />
              </div>
              {/* <div className="col-1"></div> */}
              <div className="col-3">
                <FormControl fullWidth size='small' margin='dense'>
                  <InputLabel  id="demo-simple-select-label">Trạng thái</InputLabel>
                  <Controller
                      control={control}
                      {...register('isLocked')}
                      render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            {...field}
                          >
                            <MenuItem value={0}>Tất cả</MenuItem>
                            <MenuItem value={1}>Bị khóa</MenuItem>
                            <MenuItem value={2}>Hiệu lực</MenuItem>
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

            <DialogContent dividers>
                <div className={styles.report_info_container}>
                    <CanvasJSChart 
                          options = {optionsChart} 
                          containerProps={{ width: '100%', height: '200px' }}
                      />
                    <div className={styles.title}>
                      Danh sách báo cáo
                    </div>
                    {listReport.map((report:any) => (
                      <div key={report.reportId} className={styles.report_info}>
                        <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                                <div className="avatar avatar-online">
                                    <img src={BASE_URL_MEDIA + '/' + report?.avatar} className="w-px-40 h-px-40 rounded-circle" />
                                </div>
                            </div>
                            <div className="flex-grow-1">
                                <span className="fw-semibold d-block">
                                    {report?.username} 
                                    <small className={`${styles.reason}`}> {report.reason}</small>
                                </span>
                                {/* <br /> */}
                                <small className={`${styles.reason_msg}`}> {report.message} </small>
                            </div>
                        </div>
                      </div>
                    ))}
                    
                </div>
            </DialogContent>

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

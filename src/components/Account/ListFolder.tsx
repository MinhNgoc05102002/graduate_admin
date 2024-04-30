import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { Post } from "~/services/axios";
import { CheckResponseSuccess, GetIdFromCurrentPage } from "~/utils/common";
import Loading from "../Loading/Index";
import { IFolder } from "~/types/IFolder";
import BoxFolderAccount from "./Box/BoxFolderAccount";

// truyền username của user đang đăng nhập vào đây
export default function ListFolder(props:any) {
    const {username, type = "ACCOUNT", setIsLoading, reload, setReload} = props
    const userData = useAppSelector(inforUser);
    const [listFolder, setListFolder] = useState<IFolder[]>([]);
    // const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");
    
    useEffect(() => {
        if (userData?.token) {
            getFolder();
        }
    }, [userData?.token, username])

    useEffect(() => {
        if (reload == true) {
            getFolder();
            setReload(false);
        }
    }, [reload])

    const getFolder = async () => {
        setIsLoading(true);

        let api = "/api/Folder/get-folder-by-username";
        let containerId = null;
        let user = username;

        if (type != "ACCOUNT") {
            api = "/api/Folder/get-list-folder-by-class";
            containerId = GetIdFromCurrentPage();
            user = ""
        }

        await Post(
            api, 
            {
                pageSize: 100,
                pageIndex: 0,
                searchText: search,
                username: user,
                containerId: containerId
            }, 
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let listFolder = res?.returnObj?.listResult;
                setListFolder(listFolder);
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

    const getFolderByClass = async () => {
        // dispatch(login(formLogin))
        setIsLoading(true);
        await Post(
            "/api/Folder/get-folder-by-username", 
            {
                pageSize: 100,
                pageIndex: 0,
                searchText: search,
                username: username
            }, 
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let listFolder = res?.returnObj?.listResult;
                setListFolder(listFolder);
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

    return (
        <>
            <ToastContainer />

            <div className="mt-5">

                {listFolder.map((folder, index) => {
                    return (
                    <div key={folder.folderId}>
                        <BoxFolderAccount folder={folder} />
                    </div>)
                })}

            </div>
        </>)
};

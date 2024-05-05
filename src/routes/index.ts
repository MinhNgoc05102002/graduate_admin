import AuthLayout from "~/layouts/Auth/AuthLayout"
import { DefaultLayout } from "~/layouts/Index"
import { LoginPage } from "~/pages"
import Account from "~/pages/account"
import Classes from "~/pages/class/Class"
import CreateAdmin from "~/pages/create-admin/CreateAdmin"
import CreateCategory from "~/pages/create-category/CreateCategory"
import Credit from "~/pages/credit/Credit"
import Dashboard from "~/pages/dashboard"
import Folder from "~/pages/folder/Folder"
import Maintain from "~/pages/maintain/Maintain"
import ManageAccount from "~/pages/manage-account/ManageAccount"
import ManageCategory from "~/pages/manage-category/ManageCategory"
import ManageCredit from "~/pages/manage-credit/ManageCredit"
import Manage from "~/pages/manage/Manage"
import Register from "~/pages/register/index"

export const PUBLIC_ROUTER = [
    {
        path:"/login",
        page: LoginPage,
        layout: null
    },
]

export const PRIVATE_ROUTER = [
    // {
        //     path:"/",
        //     page: HomePage,
        //     layout: null
        // }, 
        
    // ??? comment lại thì bị lỗi ???
    {
        path:"/register",
        page: Register,
        layout: AuthLayout
    },
    {
        // path:"/dashboard",
        path:"/",
        page: Dashboard,
        layout: DefaultLayout
    },
    {
        path:"/account/:username",
        page: Account,
        layout: DefaultLayout
    },
    {
        path:"/account/folders/:username",
        page: Account,
        layout: DefaultLayout
    },
    {
        path:"/account/classes/:username",
        page: Account,
        layout: DefaultLayout
    },
    {
        path:"/account/history/:username",
        page: Account,
        layout: DefaultLayout
    },
    {
        path:"/credit/:id",
        page: Credit,
        layout: DefaultLayout
    },
    {
        path:"/folder/:id",
        page: Folder,
        layout: DefaultLayout
    },
    {
        path:"/class/:id",
        page: Classes,
        layout: DefaultLayout
    },
    // route admin
    {
        path:"/manage-credit",
        page: ManageCredit,
        layout: DefaultLayout
    },
    {
        path:"/manage-account",
        page: ManageAccount,
        layout: DefaultLayout
    },
    {
        path:"/manage-category",
        page: ManageCategory,
        layout: DefaultLayout
    },
    {
        path:"/manage",
        page: Manage,
        layout: DefaultLayout
    },
    {
        path:"/create-admin",
        page: CreateAdmin,
        layout: DefaultLayout
    },
    {
        path:"/category",
        page: CreateCategory,
        layout: DefaultLayout
    },
    {
        path:"/category/:id",
        page: CreateCategory,
        layout: DefaultLayout
    },
    // {
    //     path:"/create-credit/:id",
    //     page: CreateCredit,
    //     layout: DefaultLayout
    // },
    // {
    //     path:"/create-folder",
    //     page: CreateFolder,
    //     layout: DefaultLayout
    // },
    // {
    //     path:"/create-folder/:id",
    //     page: CreateFolder,
    //     layout: DefaultLayout
    // },
    // {
    //     path:"/create-class",
    //     page: CreateClass,
    //     layout: DefaultLayout
    // },
    // {
    //     path:"/create-class/:id",
    //     page: CreateClass,
    //     layout: DefaultLayout
    // },
    // {
    //     path:"/learn/:id",
    //     page: Learn,
    //     layout: null
    // },
    // {
    //     path:"/exam/:id",
    //     page: Exam,
    //     layout: null
    // },
    // {
    //     path:"/match/:id",
    //     page: Match,
    //     layout: null
    // },
    // {
    //     path:"/search/:searchText",
    //     page: Search,
    //     layout: DefaultLayout
    // },
    // {
    //     path:"/search",
    //     page: Search,
    //     layout: DefaultLayout
    // },
    // {
    //     path:"/setting",
    //     page: Setting,
    //     layout: DefaultLayout
    // },
    {
        path:"/maintain",
        page: Maintain,
        layout: DefaultLayout
    },
    // {
    //     path:"/account/:username/:list",
    //     page: Account,
    //     layout: DefaultLayout
    // }
]
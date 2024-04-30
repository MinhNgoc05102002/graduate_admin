import AuthLayout from "~/layouts/Auth/AuthLayout"
import { DefaultLayout } from "~/layouts/Index"
import { HomePage, LoginPage } from "~/pages"
import Account from "~/pages/account"
import Credit from "~/pages/credit/Credit"
import Dashboard from "~/pages/dashboard"
import Folder from "~/pages/folder/Folder"
import Classes from "~/pages/class/Class"
import Register from "~/pages/register/index"
import CreateCredit from "~/pages/create-credit/CreateCredit"
import Maintain from "~/pages/maintain/Maintain"
import CreateFolder from "~/pages/create-folder/CreateFolder"
import Learn from "~/pages/learn/Learn"
import Search from "~/pages/search/Search"
import CreateClass from "~/pages/create-class/CreateClass"
import Setting from "~/pages/settingpage/Setting"
import Exam from "~/pages/exam/Exam"
import Match from "~/pages/match/Match"

export const PUBLIC_ROUTER = [
    {
        path:"/login",
        page: LoginPage,
        layout: null
    },
    {
        path:"/register",
        page: Register,
        layout: AuthLayout
    },
]

export const PRIVATE_ROUTER = [
    // {
    //     path:"/",
    //     page: HomePage,
    //     layout: null
    // }, 
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
    {
        path:"/create-credit",
        page: CreateCredit,
        layout: DefaultLayout
    },
    {
        path:"/create-credit/:id",
        page: CreateCredit,
        layout: DefaultLayout
    },
    {
        path:"/create-folder",
        page: CreateFolder,
        layout: DefaultLayout
    },
    {
        path:"/create-folder/:id",
        page: CreateFolder,
        layout: DefaultLayout
    },
    {
        path:"/create-class",
        page: CreateClass,
        layout: DefaultLayout
    },
    {
        path:"/create-class/:id",
        page: CreateClass,
        layout: DefaultLayout
    },
    {
        path:"/learn/:id",
        page: Learn,
        layout: null
    },
    {
        path:"/exam/:id",
        page: Exam,
        layout: null
    },
    {
        path:"/match/:id",
        page: Match,
        layout: null
    },
    {
        path:"/search/:searchText",
        page: Search,
        layout: DefaultLayout
    },
    {
        path:"/search",
        page: Search,
        layout: DefaultLayout
    },
    {
        path:"/setting",
        page: Setting,
        layout: DefaultLayout
    },
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
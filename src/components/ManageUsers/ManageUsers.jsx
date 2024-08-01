import {
  Box,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  Skeleton,
} from "@mui/material";
import {
  DropDownBox,
  ManageUsersContainer,
  ManageUsersHeading,
  ManageUsersWrapper,
} from "./ManangeUsersStyled";
import SearchIcon from "@mui/icons-material/Search";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MUIDataTable from "mui-datatables";
import { useGetUserListByNameMutation } from "../../api/UserList";
import { useDeactivateUserByNameMutation } from "../../api/DeactivateUser";
import { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import { handleNotification } from "../../slices/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import ControlledSwitches from "../SwitchComponent";
import { userDataSelector } from "../../slices/userSlice/userSelector";
import { updateUserData } from "../../slices/userSlice/user";
import CustomModal from "../reuse/CustomModal";
import { useDeleteUserByNameMutation } from "../../api/DeleteUser";
import BasicMenu from "../Dashboard/ProfileMenu";
import { useNavigate } from "react-router-dom";
const ManageUsers = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("");
  const [modal, setModal] = useState(false);
  const openModal = (id) => {
    setModal(true);
    setView(id);
  };
  const closeModal = () => {
    setModal(false);
  };
  const dispatch = useDispatch();
  const [userList, { data, isLoading, error, isSuccess: userListSuccess }] =
    useGetUserListByNameMutation();
  const { data: userData } = useSelector(userDataSelector);
  console.log(userData, "thisIsState");
  const [
    deactivateUser,
    {
      data: deactivateUserData,
      isLoading: deactivateUserLoading,
      error: deactivateUserError,
      isSuccess: deactivateUserSuccess,
    },
  ] = useDeactivateUserByNameMutation();
  const [
    userDeleteApi,
    {
      data: userDeleteData,
      isLoading: userDeleteLoading,
      error: userDeleteError,
      isSuccess: userDeleteSuccess,
    },
  ] = useDeleteUserByNameMutation();

  useEffect(() => {
    if (data && data.data) dispatch(updateUserData(data?.data));
  }, [data, userListSuccess]);
  useEffect(() => {
    const reqParams = {
      search_string: "",
      page: 0,
      sortValue: "",
      sortOrder: "",
      pageSize: 40,
    };
    userList(reqParams);
  }, [deactivateUserSuccess, userDeleteSuccess]);

  const columns = [
    {
      name: "name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: () => ({
          style: { backgroundColor: "#E08300", color: "black" },
        }),
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: () => ({
          style: { backgroundColor: "#E08300", color: "black" },
        }),
      },
    },
    {
      name: "country",
      label: "Country",
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: () => ({
          style: { backgroundColor: "#E08300", color: "black" },
        }),
      },
    },
    {
      name: "isTopSportUser",
      label: "TopSport",
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: () => ({
          style: { backgroundColor: "#E08300", color: "black" },
        }),
      },
    },
    {
      name: "isActive",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#E08300",
            color: "black",
            display: "flex",
            justifyContent: "center",
          },
        }),
        customBodyRender: (value, rowData) => {
          return (
            <>
              <ControlledSwitches
                value={value}
                rowData={rowData}
                statusChangeApi={deactivateUser}
                deactivateUserData={deactivateUserData}
                userList={userList}
              />
            </>
          );
        },
      },
    },
    {
      name: "_id",
      label: "Actions",
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#E08300",
            color: "black",
          },
        }),
        customBodyRender: (value, rowData) => (
          <>
            {console.log(
              data?.data?.isVerified,
              userData,
              value,
              "data?.data?.isVerified"
            )}
            <Box display="flex" gap="10px">
              <VisibilityIcon
                onClick={() => navigate(`/userprofile/${value}`)}
              ></VisibilityIcon>
              <DeleteIcon onClick={() => openModal(value)} />
            </Box>
          </>
        ),
      },
    },
  ];
  const options = {
    filter: false,
    download: false,
    search: false,
    print: false,
    viewColumns: false,
    selectableRows: false,
  };
  const permanentDelete = async () => {
    try {
      userDeleteApi({ userId: view });
    } catch (error) {
      console.log(" Error", error);
    }
  };
  useEffect(() => {
    if (userDeleteLoading) return;
    if (userDeleteData?.code === 200) {
      if (userDeleteData) {
        dispatch(
          handleNotification({
            state: true,
            message: userDeleteData?.message,
            severity: userDeleteData?.code,
          })
        );
        closeModal();
      } else {
        dispatch(
          handleNotification({
            state: true,
            message: userDeleteData?.message,
            severity: userDeleteData?.status,
          })
        );
      }
    }
  }, [userDeleteData, userDeleteLoading]);
  return (
    <>
      <ManageUsersContainer>
        <ManageUsersWrapper
          sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <Box>
            <ManageUsersHeading>Manage User</ManageUsersHeading>
          </Box>
          <Box border={"1px solid rgba(0, 0, 0, 0.1)"}>
            <Box
              padding={"15px"}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Box
                className="inputbox"
                sx={{
                  display: "flex",
                  border: "1px solid rgba(0,0,0,0.1)",
                  width: "40%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <SearchIcon />
                </Box>
                <input type="search"></input>
              </Box>
              <DropDownBox>
                <MenuOpenIcon />
                {/* <BasicMenu /> */}
              </DropDownBox>
            </Box>
            <MUIDataTable data={userData} columns={columns} options={options} />
            <CustomModal
              modal={modal}
              closeModal={closeModal}
              userid={view}
              userDeleteApi={userDeleteApi}
              userDeleteData={userDeleteData}
              userDeleteLoading={userDeleteLoading}
              permanentDelete={permanentDelete}
            />
          </Box>
        </ManageUsersWrapper>
      </ManageUsersContainer>
    </>
  );
};
export default ManageUsers;

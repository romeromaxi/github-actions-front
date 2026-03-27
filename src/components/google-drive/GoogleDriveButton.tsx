import React, {useState} from "react";
import useDrivePicker from "react-google-drive-picker";
import {CallbackDoc, PickerCallback, PickerConfiguration} from "react-google-drive-picker/dist/typeDefs";
import {Button, SvgIcon} from "@mui/material";
import {googleDriveMimeTypes} from "types/files/filesEnums";
import {LoaderBlockUI} from "components/loader";
import ButtonFileNew from "../buttons/ButtonFileNew";

interface GoogleDriveButtonProps {
    uploadFiles: (files: File[]) => void,
    multiselect?: boolean,
    square?: boolean
}

function GoogleDriveButton({ uploadFiles, multiselect, square }: GoogleDriveButtonProps) {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [openPicker] = useDrivePicker();
    
    const convertToFile = (item: CallbackDoc, blob: Blob) => {
        return new File([blob], item.name, { type: blob.type });
    };

    const getMediaFileDrive = async (item: CallbackDoc, fetchOptions: {}) => {
        let mimeType: string | null = null;
        let mimeTypeExtension: string | null = null;

        if (item.mimeType === 'application/vnd.google-apps.document') {
            mimeType =
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            mimeTypeExtension = 'docx';
        } else if (item.mimeType === 'application/vnd.google-apps.spreadsheet') {
            mimeType =
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            mimeTypeExtension = 'xlsx';
        } else if (item.mimeType === 'application/vnd.google-apps.presentation') {
            mimeType = 'application/pdf';
            mimeTypeExtension = 'pdf';
        }

        const response = !mimeType
            ? await fetch(
                `${window.GOOGLE_DRIVE_API}/${item.id}?alt=media`,
                fetchOptions,
            )
            : await fetch(
                `${window.GOOGLE_DRIVE_API}/${item.id}/export?mimeType=${mimeType}`,
                fetchOptions,
            );

        if (response.ok) {
            if (!!mimeTypeExtension && !item.name.includes('.'))
                item.name = `${item.name}.${mimeTypeExtension}`;

            return convertToFile(item, await response.blob());
        }

        return {} as unknown as File;
    };
    
    const callbackPickerDrive = (
        data: PickerCallback,
        tokenInfo: GoogleApiOAuth2TokenObject,
    ) => {
        if (data.action === 'picked') {
            setLoading(true);
            if (!tokenInfo) {
                tokenInfo = gapi.auth.getToken();
            }
            const fetchOptions = {
                headers: {
                    Authorization: `Bearer ${tokenInfo.access_token}`,
                },
            };

            const list: Promise<File>[] = data.docs.map((item) =>
                getMediaFileDrive(item, fetchOptions),
            );

            Promise.all(list).then((files) => {
                const finalFiles = files.filter((x: File) => !!x.name);
                setLoading(false);
                uploadFiles(finalFiles);
            });
        }
    };
    
    const onHandleOpenPickerDrive = () => {
        let tokenInfo = gapi.auth.getToken();
        const pickerConfig: PickerConfiguration = {
            clientId: window.GOOGLE_DRIVE_API_CLIENT_ID,
            developerKey: window.GOOGLE_DRIVE_API_KEY,
            viewId: 'DOCS',
            token: tokenInfo ? tokenInfo.access_token : undefined,
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: multiselect,
            viewMimeTypes: googleDriveMimeTypes,
            callbackFunction: (data) => callbackPickerDrive(data, tokenInfo),
        };
        openPicker(pickerConfig);
    };
    
    const onClickDrive = () => {
        gapi.load('client:auth2', () => {
            gapi.client
                .init({
                    apiKey: window.GOOGLE_DRIVE_API_KEY,
                })
                .then(onHandleOpenPickerDrive);
        });
    };
    
    return (
        <React.Fragment>
            {
                square ?
                    <ButtonFileNew icon={GoogleDriveIcon}
                                   onClick={onClickDrive}
                                   title={"Importar desde Drive"}  />
                    :
                    <Button
                        onClick={onClickDrive}
                        startIcon={<GoogleDriveIcon />}
                        color={'inherit'}
                        variant={'contained'}
                    >
                        Importar desde Drive
                    </Button>
            }
            
            {isLoading && <LoaderBlockUI />}
        </React.Fragment>
    )
}

function GoogleDriveIcon() {
    return (
        <SvgIcon viewBox="0 0 141.7 141.7" id="google-drive">
            <path
                fill="#0066da"
                d="M25.8,104.7l4.7,8.1c1,1.7,2.4,3,4,4l16.7-29H17.8c0,1.9,0.5,3.8,1.5,5.5L25.8,104.7z"
            ></path>
            <path
                fill="#ea4335"
                d="M107.2,116.8c1.6-1,3-2.3,4-4l1.9-3.3l9.3-16.1c1-1.7,1.5-3.6,1.5-5.5H90.5l7.1,14L107.2,116.8z"
            ></path>
            <path
                fill="#00832d"
                d="M70.9,53.8l16.7-29c-1.6-1-3.5-1.5-5.5-1.5H59.6c-1.9,0-3.8,0.5-5.5,1.5L70.9,53.8z"
            ></path>
            <path
                fill="#2684fc"
                d="M90.5,87.9H51.2l-16.7,29c1.6,1,3.5,1.5,5.5,1.5h61.8c1.9,0,3.8-0.5,5.5-1.5L90.5,87.9z"
            ></path>
            <path
                fill="#ffba00"
                d="M107.1,55.7L91.6,28.9c-1-1.7-2.4-3-4-4l-16.7,29l19.6,34.1h33.4c0-1.9-0.5-3.8-1.5-5.5L107.1,55.7z"
            ></path>
            <path
                fill="#00ac47"
                d="M19.2,82.4c-1,1.7-1.5,3.6-1.5,5.5h33.4l19.6-34.1l-16.7-29c-1.6,1-3,2.3-4,4L34.6,55.7L19.2,82.4z"
            ></path>
        </SvgIcon>
    )
}

export {
    GoogleDriveButton
}
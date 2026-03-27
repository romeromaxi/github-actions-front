import React, {useState} from "react";
import DropboxChooser from 'react-dropbox-chooser';
import {Button, SvgIcon} from "@mui/material";
import {downloadFileAsBlob} from "util/helpers";
import {LoaderBlockUI} from "components/loader";
import ButtonFileNew from "../buttons/ButtonFileNew";

interface DropboxButtonProps {
    uploadFiles: (files: File[]) => void,
    square?: boolean
}

function DropboxButton({ uploadFiles, square }: DropboxButtonProps) {
    const [isLoading, setLoading] = useState<boolean>(false);

    const onSuccessDropbox = (dFiles: any[]) => {
        if (dFiles.length > 0) {
            setLoading(true);
            Promise.all(
                dFiles.map((f) => {
                    return downloadFileAsBlob(f.link, f.name);
                }),
            ).then((newFiles) => {
                setLoading(false);
                uploadFiles(newFiles);
            });
        }
    };
    
    return (
        <React.Fragment>
            <DropboxChooser
                appKey={window.DROPBOX_APP_KEY}
                success={(files) => onSuccessDropbox(files)}
                multiselect={false}
            >
                {
                    square ?

                        <ButtonFileNew icon={DropboxIcon}
                                       onClick={() => {}}
                                       title={"Importar desde Dropbox"}  />
                        :
                        <Button
                            onClick={() => {}}
                            startIcon={<DropboxIcon />}
                            color={'inherit'}
                            variant={'contained'}
                        >
                            Importar desde Dropbox
                        </Button>
                }
            </DropboxChooser>

            {isLoading && <LoaderBlockUI />}
        </React.Fragment>
    )
}

function DropboxIcon() {
    return (
        <SvgIcon
            viewBox="0 0 64 64"
            id="dropbox"
            width="64"
            height="64"
        >
            <path
                fill="#1083DD"
                d="M50.39 25.118h.001-.001zM32 36.564zM32.038 38.872 19.359 49.579 14 45.974v4.04l18 11.048 18-11.048v-4.04l-5.319 3.605z"
            ></path>
            <path
                fill="#0A6CBC"
                d="m32 61.062 18-11.048v-4.04l-5.319 3.605-12.643-10.707"
            ></path>
            <path
                fill="#1083DD"
                d="M32 36.564 13.611 25.12 1 35.299 19.239 47.3 32 36.564z"
            ></path>
            <path
                fill="#0A6CBC"
                d="M1 35.299 19.239 47.3 32 36.564"
            ></path>
            <path
                fill="#38B4F9"
                d="M32 36.564 44.763 47.3 63 35.3 50.391 25.118h-.001z"
            ></path>
            <path
                fill="#0594DB"
                d="M44.763 47.3 63 35.3 50.391 25.118h-.001"
            ></path>
            <path
                fill="#1083DD"
                d="M44.763 3.1 32.002 14H32l18.391 11.118 12.414-10.056z"
            ></path>
            <path
                fill="#0A6CBC"
                d="M50.391 25.118 63 15.062 44.763 3.1"
            ></path>
            <path
                fill="#38B4F9"
                d="M32.002 14 19.239 3.1 1.002 15.021l12.609 10.3L32 14z"
            ></path>
            <path
                fill="#0594DB"
                d="M13.611 25.281 32 14h.002L19.239 3.1"
            ></path>
        </SvgIcon>
    )
}

export {
    DropboxButton
}
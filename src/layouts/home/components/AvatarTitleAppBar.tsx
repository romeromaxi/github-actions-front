import React, { useEffect, useState } from 'react';
import { useTypedSelector } from 'hooks/useTypedSelector';
import { Box, Dialog, DialogContent, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Skeleton } from '@mui/lab';
import { FileBlobResponseFields } from 'types/files/filesData';
import { ButtonIconFile } from 'components/buttons/ButtonIconFile';

function AvatarTitleAppBar() {
  const { fnLoadAvatar, fnUpdateAvatar } = useTypedSelector(
    (state) => state.title,
  );
  const [avatarSource, setAvatarSource] = useState<any>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [showDetailAvatar, setShowDetailAvatar] = useState<boolean>(false);

  const openDetailAvatar = () => setShowDetailAvatar(true);

  const hideDetailAvatar = () => setShowDetailAvatar(false);

  const loadAvatar = () => {
    if (!!fnLoadAvatar) {
      setLoading(true);
      fnLoadAvatar()
        .then((blobResponse) => {
          var image = blobResponse[FileBlobResponseFields.File];
          setAvatarSource(image.size ? URL.createObjectURL(image) : '');
        })
        .catch(() => setAvatarSource(''))
        .finally(() => setLoading(false));
    } else {
      setAvatarSource('');
    }
  };

  const onSaveLogo = (logo: File) => {
    setShowDetailAvatar(false);

    if (!!fnUpdateAvatar) {
      setLoading(true);
      fnUpdateAvatar(logo).finally(loadAvatar);
    }
  };

  useEffect(() => {
    loadAvatar();
  }, [fnLoadAvatar]);

  return (
    <React.Fragment>
      {isLoading ? (
        <Skeleton variant="rounded" width={35} height={35} />
      ) : avatarSource && avatarSource !== '' ? (
        <>
          <Box
            component="div"
            sx={{
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              backgroundImage: `url(${avatarSource})`,
              zIndex: 2,
              borderRadius: '10px',
              width: 40,
              height: 40,
              backgroundSize: 'contain',
              '&:hover': {
                cursor: 'pointer',
              },
            }}
            onClick={openDetailAvatar}
          />

          <AvatarDetailDialog
            open={showDetailAvatar}
            avatarSource={avatarSource}
            onClose={hideDetailAvatar}
            onSaveLogo={fnUpdateAvatar ? onSaveLogo : undefined}
          />
        </>
      ) : (
        <></>
      )}
    </React.Fragment>
  );
}

interface AvatarDetailDialogProps {
  open: boolean;
  avatarSource: any;
  onClose: () => void;
  onSaveLogo?: (logo: File) => void;
}

function AvatarDetailDialog({
  open,
  avatarSource,
  onClose,
  onSaveLogo,
}: AvatarDetailDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Stack>
          <Stack direction={'row'} justifyContent={'end'}>
            <IconButton onClick={onClose} color={'secondary'}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Stack direction={'row'} alignSelf={'center'}>
            <Box
              component="div"
              sx={{
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundImage: `url(${avatarSource})`,
                zIndex: 2,
                borderRadius: '10px',
                width: 300,
                height: 300,
                backgroundSize: 'contain',
              }}
            />

            {onSaveLogo && (
              <Box
                component="div"
                position={'relative'}
                sx={{
                  right: '0.75rem',
                  top: '0.75rem',
                  zIndex: 5,
                  // marginLeft: '-28px !important'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '5%',
                    right: '5%',
                  }}
                >
                  <ButtonIconFile onChange={onSaveLogo} />
                </div>
              </Box>
            )}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default AvatarTitleAppBar;

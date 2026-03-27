import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import BreadcrumbStyles from './Breadcrumb.styles';

const breadcrumbNameMap: { [key: string]: string } = {
  '/market/lines': 'market',
  '/market': 'market',
};

const breadCrumbUrlMap: { [key: string]: string } = {
  '/market': '/market/lines',
};

interface BreadCrumbProps {
  homeUrl?: string;
  routeMapper?: () => JSX.Element[];
  float?: 'left' | 'right';
}

function Breadcrumb({ homeUrl, float, routeMapper }: BreadCrumbProps) {
  const classes = BreadcrumbStyles();

  const navigate = useNavigate();
  let { pathname } = useLocation();
  Object.entries(breadcrumbNameMap).forEach((v) => {
    pathname = pathname.replace(v[0], v[1]);
  });
  let pathnames = pathname.split('/').filter((x) => x);

  const mapHomeBreadcrumb = () =>
    pathnames.length > 0 ? (
      <Link
        className={classes.tagHome}
        onClick={() => navigate(`${homeUrl || '/mi-cuenta'}`)}
      >
        Home
      </Link>
    ) : (
      <Typography className={classes.lastTag}>Home</Typography>
    );

  const mapRoutesBreadcrumb = () => {
    return pathnames.map((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
      const finalName = name.replace('-', ' ');
      const isLast = index === pathnames.length - 1;
      return isLast ? (
        <Typography key={name} className={classes.lastTag}>
          {finalName}
        </Typography>
      ) : (
        <Link
          key={name}
          className={classes.tag}
          onClick={() =>
            navigate(breadCrumbUrlMap?.[routeTo.toLowerCase()] || routeTo)
          }
        >
          {finalName}
        </Link>
      );
    });
  };

  return (
    <Breadcrumbs className={float === 'left' ? classes.rootLeft : classes.root}>
      {routeMapper && routeMapper()}
      {!routeMapper && mapHomeBreadcrumb()}

      {!routeMapper && mapRoutesBreadcrumb()}
    </Breadcrumbs>
  );
}

export default Breadcrumb;

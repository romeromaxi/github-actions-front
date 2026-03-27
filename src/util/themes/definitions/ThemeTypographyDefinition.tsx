const themeTypographyDefinition = {
    // title/xl
    h1: { 
        fontSize: '2.625rem', // 42px
        fontFamily: 'Poppins',
        fontWeight: 600,
        lineHeight: '110%',
        letterSpacing: '-0.01rem' // 1%: 0.02625rem
    },
    // title/lg
    h2: {
        fontSize: '2.25rem', // 36px
        fontFamily: 'Poppins',
        fontWeight: 600,
        lineHeight: '110%',
        letterSpacing: '-0.01rem' // 1%: 0.0225rem
    },
    // title/md
    h3: { 
        fontSize: '2rem', // 32px
        fontFamily: 'Poppins',
        fontWeight: 600,
        lineHeight: '110%',
        letterSpacing: '-0.01rem' // 1%: 0.02rem
    },
    // title/sm
    h4: { 
        fontSize: '1.5rem', // 24px
        fontFamily: 'Poppins',
        fontWeight: 600,
        lineHeight: '120%',
        letterSpacing: '-0.02rem' // 2%: 0.03rem
    },
    // title/xs
    h5: { 
        fontSize: '1.25rem', // 20px
        fontFamily: 'Poppins',
        fontWeight: 600,
        lineHeight: '120%',
        letterSpacing: '-0.02rem' // 2%: 0.03rem
    },
    // title/2xs
    h6: { 
        fontSize: '1.125rem', // 18px
        fontFamily: 'Poppins',
        fontWeight: 600,
        lineHeight: '120%',
        letterSpacing: '-0.02rem' // 2%: 0.03rem
    },
    
    //eyebrow/lg
    eyebrow1: {
        fontSize: '1rem', // 16px
        fontFamily: 'Geist',
        fontWeight: 600,
        lineHeight: '110%',
        letterSpacing: '-0.01rem' // 1%: -0.01rem
    },
    //eyebrow/md
    eyebrow2: {
        fontSize: '0.875rem', // 14px
        fontFamily: 'Geist',
        fontWeight: 600,
        lineHeight: '110%',
        letterSpacing: '-0.01rem' // 1%: 0.00875rem
    },
    //eyebrow/sm
    eyebrow3: {
        fontSize: '0.75rem', // 12px
        fontFamily: 'Geist',
        fontWeight: 600,
        lineHeight: '110%',
        letterSpacing: '-0.01rem' 
    },
    
    // body/lg = body/xl
    body1: {
        fontSize: '1.125rem', // 18px
        fontFamily: 'Geist',
        lineHeight: '140%',
    },
    // body/md
    body2: {
        fontSize: '1rem', // 16px
        fontFamily: 'Geist',
        lineHeight: '130%',
    },
    // body/sm
    body3: {
        fontSize: '0.875rem', // 14px
        fontFamily: 'Geist',
        lineHeight: '130%',
    },
    // body/xs
    body4: {
        fontSize: '0.75rem', // 12px
        fontFamily: 'Geist',
        lineHeight: '130%',
    },

    body5: {
        fontSize: '0.7rem', // 11px
        fontFamily: 'Geist',
        lineHeight: '125%',
    },

    // body/sm: Por ahora igual a body/sm pero se mantiene libre por si vemos algun componente que pueda ser subtitle1
    subtitle1: {
        fontSize: '0.875rem', // 14px
        fontFamily: 'Geist',
        lineHeight: '130%',
    },
    // body/xs: Por ahora igual a body/xs pero se mantiene libre por si vemos algun componente que pueda ser subtitle2
    subtitle2: {
        fontSize: '0.75rem', // 12px
        fontFamily: 'Geist',
        lineHeight: '130%',
    },
    
    // button/lg
    button1: {
        fontSize: '1.125rem', // 18px
        fontFamily: 'Geist !important',
        fontWeight: 600,
        lineHeight: '140%',
        letterSpacing: 0 // 0%
    },
    // button/md
    button2: {
        fontSize: '1rem', // 16px
        fontFamily: 'Geist !important',
        fontWeight: 600,
        lineHeight: '140%',
        letterSpacing: 0 // 0%
    },
    // button/md
    button: {
        fontSize: '1rem', // 16px
        fontFamily: 'Geist !important',
        fontWeight: 600,
        lineHeight: '140%',
        letterSpacing: 0 // 0%
    },
    // button/sm
    button3: {
        fontSize: '0.875rem', // 14px
        fontFamily: 'Geist !important',
        fontWeight: 600,
        lineHeight: '140%',
        letterSpacing: 0 // 0%
    },
  
    labelForms: {
        fontFamily: 'Geist',
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: '110%',
        letterSpacing: '-0.02rem'
    },
    textForms: {
        fontFamily: 'Geist',
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: '110%',
        letterSpacing: '0rem'
    },
    
    // Ver si aplican en nuevo modelo UX
    caption: {
        fontSize: '0.8rem', 
        fontFamily: 'Geist',
        lineHeight: '130%',
    },
    label: {
        fontSize: '0.95rem',
        fontFamily: 'Geist',
        lineHeight: '140%',
        letterSpacing: 0 // 0%
    },
}

export { themeTypographyDefinition }
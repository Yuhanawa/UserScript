({
  pages: ["article"],
  values: {
    'remove':
      `#csdn-toolbar{ display: none!important; }`,
    'opacity':
      `#csdn-toolbar{
      transition: opacity 0.5s!important;
      opacity: 0.75;
      backdrop-filter: blur(8px);
      filter: blur(2px);
    } 
    #csdn-toolbar:hover,
    #csdn-toolbar:focus,
    #csdn-toolbar:focus-within,
    #csdn-toolbar:active {
      opacity: 1;
      backdrop-filter: none;
      filter: none;
    } `,
    'opacity_static':
      `#csdn-toolbar{position: static !important; opacity: 0.5; transition: opacity 1.5s!important;} #csdn-toolbar:hover{opacity: 1;}`,
    'static':
      `#csdn-toolbar{position: static !important;}`,
    'off': null
  }
})

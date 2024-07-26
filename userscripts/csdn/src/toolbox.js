({
	pages: ["article"],
	value: {
		remove: `.left-toolbox{
          display: none!important;
        }`,
		relative: `.left-toolbox{
          z-index: 996!important;
          left: 0px!important;
          bottom: 0px!important;
          width: 900px!important;
          position: relative!important;
        }`,
		opacity: `.left-toolbox{
          opacity: 0.55!important;
          transition: opacity 0.5s!important;
        }
        .left-toolbox:hover{
          opacity: 1!important;
        }`,
		opacity_relative: `.left-toolbox{
          z-index: 996!important;
          left: 0px!important;
          bottom: 0px!important;
          width: 900px!important;
          position: relative!important;
          opacity: 0.55!important;
          transition: opacity 1.5s!important;
        }
        .left-toolbox:hover{
          opacity: 1!important;
        }`,
		off: null,
	},
});

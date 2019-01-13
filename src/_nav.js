export default {
  items: [
    {
      id:1,
      name: 'Dashboard',
      url: '/dashboard',
      icon: '',
      badge: {
        variant: 'info',
        text: '...',
      },
    },
    {
      id:2,
      title: true,
      name: 'User Manager',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      id:3,
      name: 'Client Menu',
      url: '/client',
      icon: 'icon-pencil',
    },
    {
      id:4,
      name: 'E-Filing',
      url: '/efiling',
      icon: 'icon-puzzle',
    },
    {
      id:5,
      name: 'Fees Module',
      url: '/fee',
      icon: 'icon-cursor',
    },
    {
      id:7,
      title: true,
      name: 'Reports',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      id:8,
      name: 'Client Creation Report',
      url: '/users',
      icon: 'icon-speedometer',
    },
    {
      id:9,
      name: 'E-Filing Report',
      url: '/base/forms',
      icon: 'icon-speedometer icon-pie-chart',
    },
    {
      id:10,
      name: 'Fees Module Report',
      url: '/base/forms',
      icon: 'icon-speedometer icon-pie-chart',
    },
    {
      id:11,
      title: true,
      name: 'Master Forms',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      id:12,
      name: 'Client Master',
      url: '/clientmaster',
      icon: 'icon-pencil',
    },
   
  ],
};

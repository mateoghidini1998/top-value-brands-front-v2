import {
  AudioWaveform,
  BookOpen,
  Bot,
  // Settings2,
  Frame,
  GalleryVerticalEnd,
  PersonStandingIcon,
  PieChart,
  SquareTerminal,
  User,
} from "lucide-react";

export const routes = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Amazon",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Walmart",
      logo: AudioWaveform,
      plan: "Startup",
    },
    // {
    //   name: "Evil Corp.",
    //   logo: Command,
    //   plan: "Free",
    // },
  ],
  navMain: [
    {
      title: "Inventory Management",
      url: "/inventory",
      icon: SquareTerminal,
      items: [
        {
          title: "Inventory",
          url: "/inventory",
        },
        // {
        //   title: "Tracked Products",
        //   url: "/inventory/tracked-products",
        // },
        // {
        //   title: "Deleted Products",
        //   url: "/inventory/manage-products",
        // },
      ],
    },
    {
      title: "Purchase Orders",
      url: "/purchase-orders",
      icon: Bot,
      items: [
        {
          title: "All POs",
          url: "/purchase-orders",
        },
        {
          title: "Create PO",
          url: "/purchase-orders/create",
        },
        {
          title: "Closed POs",
          url: "/purchase-orders/closed",
        },
      ],
    },
    {
      title: "Warehouse",
      url: "/warehouse",
      icon: BookOpen,
      items: [
        // {
        //   title: "Warehouse",
        //   url: "/warehouse",
        // },
        {
          title: "Incoming POs",
          url: "/warehouse/incoming-shipments",
        },
        {
          title: "Outgoing Shipments",
          url: "/warehouse/outgoing-shipments",
        },
        {
          title: "Storage",
          url: "/warehouse/storage",
        },
        // {
        //   title: "Changelog",
        //   url: "#",
        // },
      ],
    },
    // USERS

    {
      title: "Users",
      url: "/users",
      icon: User,
      // items: [
      //   {
      //     title: "Introduction",
      //     url: "#",
      //   },
      //   {
      //     title: "Get Started",
      //     url: "#",
      //   },
      //   {
      //     title: "Tutorials",
      //     url: "#",
      //   },
      //   {
      //     title: "Changelog",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Suppliers",
      url: "/suppliers",
      icon: PersonStandingIcon,
      // items: [
      //   {
      //     title: "General",
      //     url: "#",
      //   },
      //   {
      //     title: "Team",
      //     url: "#",
      //   },
      //   {
      //     title: "Billing",
      //     url: "#",
      //   },
      //   {
      //     title: "Limits",
      //     url: "#",
      //   },
      // ],
    },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "Features",
    //       url: "settings/features",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

"use client";
import { Book, Menu, Sunset, Trees, UsersRound, Zap } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ModeToggle } from "@/components/theme/theme-toggle";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/stores/session";
import { usePresence } from "@/hooks/usePresence";
import useAdmin from "@/hooks/use-admin";
import { AdminUserIcon } from "./custom-icons/custom-icons";

function AvatarButton({ Image, name }: { Image: string | undefined; name: string }) {
  const isPresent = usePresence();
  const getInitials = (name: string | undefined) => {
    if (!name || name === undefined) return "";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link href="/dashboard/account" className="relative">
          <Avatar className="rounded-lg">
            <AvatarImage src={Image} alt={name} />
            <AvatarFallback>{getInitials(name) || "SG"}</AvatarFallback>
          </Avatar>
          <span className={cn("absolute -end-1 -top-1 size-3 rounded-full border-2 border-background", isPresent ? "bg-emerald-500" : "bg-yellow-500")}>
            <span className="sr-only">{isPresent ? "Online" : "Away"}</span>
          </span>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src={Image} />
            <AvatarFallback>{getInitials(name) || "SG"}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{name}</h4>
            <p className="text-sm text-muted-foreground">Click to view and manage your account settings</p>
            <div className="flex items-center pt-2">
              <span className={cn("mr-2 size-2 rounded-full", isPresent ? "bg-emerald-500" : "bg-yellow-500")} />
              <span className="text-xs text-muted-foreground">{isPresent ? "Online" : "Away"}</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

const subMenuItemsOne = [
  {
    title: "About Us",
    description: "Bringing Ideas to reality",
    icon: <Trees className="size-5 shrink-0" />,
    route: "/about",
  },
  {
    title: "Blog",
    description: "The Latest and Greatest in the world of entrepreneurship",
    icon: <Book className="size-5 shrink-0" />,
    route: "/blog",
  },
  {
    title: "Our Team",
    description: "Get to know the people behind the scenes at Founders Club",
    icon: <UsersRound className="size-5 shrink-0" />,
    route: "/about/team",
  },
  {
    title: "Careers",
    description: "Join our team and help us build the future",
    icon: <Sunset className="size-5 shrink-0" />,
    route: "/about",
  },
];

const subMenuItemsTwo = [
  {
    title: "Events and Workshops",
    description: "Get the latest updates on our events and workshops",
    icon: <Zap className="size-5 shrink-0" />,
    route: "/events",
  },
  // {
  //   title: 'Contact Us',
  //   description: 'We are here to help you with any questions you have',
  //   icon: <Sunset className="size-5 shrink-0" />,
  // },
  // {
  //   title: 'Status',
  //   description: 'Check the current status of our services and APIs',
  //   icon: <Trees className="size-5 shrink-0" />,
  // },
  {
    title: "Terms of Service",
    description: "Our terms and conditions for events and more",
    icon: <Book className="size-5 shrink-0" />,
    route: "/terms",
  },
];

const isPathExcluded = (pathname: string, excludedPaths: string[]) => {
  return excludedPaths.some((path) => {
    if (path.endsWith("/*")) {
      const prefix = path.slice(0, -2); // Remove /* from the end
      return pathname.startsWith(prefix);
    }
    return pathname === path;
  });
};

const Navbar1 = () => {
  const pathname = usePathname();
  const user = useUser();
  const isAdmin = useAdmin({ user });

  const excludedRoutes = ["/studio/*", "/events/*", "/blog/posts/*", "/auth/*", "/signup", "/admin/*"];

  if (isPathExcluded(pathname, excludedRoutes)) {
    return null;
  }

  return (
    <section className="py-4 w-full flex items-center justify-center ">
      <nav className="hidden justify-between lg:flex w-full container ">
        <div className="flex items-center gap-6">
          <Link href={"/"} className="flex items-center gap-2 backdrop-blur-sm">
            <Image src="/FC-logo-short.png" alt="logo" width={640} height={640} className="w-8 h-auto" priority />
            <span className="text-xl font-bold">Founders Club</span>
          </Link>
          <div className="flex items-center">
            <Link
              className={cn(
                "text-muted-foreground",
                navigationMenuTriggerStyle,
                buttonVariants({
                  variant: "ghost",
                })
              )}
              href="/"
            >
              Home
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem className="text-muted-foreground">
                  <NavigationMenuTrigger>
                    <span>Content</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-80 p-3">
                      {subMenuItemsOne.map((item, idx) => (
                        <li key={idx}>
                          <NavigationMenuLink
                            className={cn(
                              "flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                            href={item.route}
                          >
                            {item.icon}
                            <div>
                              <div className="text-sm font-semibold">{item.title}</div>
                              <p className="text-sm leading-snug text-muted-foreground">{item.description}</p>
                            </div>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem className="text-muted-foreground">
                  <NavigationMenuTrigger>Events</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-80 p-3">
                      {subMenuItemsTwo.map((item, idx) => (
                        <li key={idx}>
                          <NavigationMenuLink
                            className={cn(
                              "flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                            href={item.route}
                          >
                            {item.icon}
                            <div>
                              <div className="text-sm font-semibold">{item.title}</div>
                              <p className="text-sm leading-snug text-muted-foreground">{item.description}</p>
                            </div>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link
              className={cn(
                "text-muted-foreground",
                navigationMenuTriggerStyle,
                buttonVariants({
                  variant: "ghost",
                })
              )}
              href="/dashboard/upcoming"
            >
              Upcoming
            </Link>
            <Link
              className={cn(
                "text-muted-foreground",
                navigationMenuTriggerStyle,
                buttonVariants({
                  variant: "ghost",
                })
              )}
              href="/contact-us"
            >
              Contact Us
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {isAdmin && (
            <Button variant="ghost" size="icon" className="" asChild>
              <Link href="/admin">
                <AdminUserIcon />
              </Link>
            </Button>
          )}
          {user ? (
            <AvatarButton Image={user?.user_metadata.picture || user?.user_metadata.avatar_url} name={user?.user_metadata.name || user?.user_metadata.full_name} />
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/auth/login" className="text-muted-foreground">
                  Log in
                </Link>
              </Button>
              <Button asChild>
                <Link href="/auth/login" className="text-foreground">
                  Sign up
                </Link>
              </Button>
            </>
          )}
        </div>
      </nav>
      <div className="block lg:hidden">
        <div className="flex items-center justify-between">
          <Link href={"/"} className="flex items-center gap-2 backdrop-blur-sm">
            <Image src="/FC-logo-short.png" alt="logo" width={640} height={640} className="w-8 h-auto" priority />
            <span className="text-xl font-bold">Founders Club</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  <Link href={"/"} className="flex items-center gap-2 backdrop-blur-sm">
                    <Image src="/FC-logo-short.png" alt="logo" width={640} height={640} className="w-8 h-auto" priority />
                    <span className="text-xl font-bold">Founders Club</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="mb-8 mt-8 flex flex-col gap-4">
                <Link href="/" className="font-semibold">
                  Home
                </Link>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="products" className="border-b-0">
                    <AccordionTrigger className="mb-4 py-0 font-semibold hover:no-underline">Content</AccordionTrigger>
                    <AccordionContent className="mt-2">
                      {subMenuItemsOne.map((item, idx) => (
                        <Link
                          key={idx}
                          className={cn(
                            "flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                          href={item.route}
                        >
                          {item.icon}
                          <div>
                            <div className="text-sm font-semibold">{item.title}</div>
                            <p className="text-sm leading-snug text-muted-foreground">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="resources" className="border-b-0">
                    <AccordionTrigger className="py-0 font-semibold hover:no-underline">Events</AccordionTrigger>
                    <AccordionContent className="mt-2">
                      {subMenuItemsTwo.map((item, idx) => (
                        <Link
                          key={idx}
                          className={cn(
                            "flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                          href={item.route}
                        >
                          {item.icon}
                          <div>
                            <div className="text-sm font-semibold">{item.title}</div>
                            <p className="text-sm leading-snug text-muted-foreground">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Link href="/dashboard/upcoming" className="font-semibold">
                  Upcoming
                </Link>
                <Link href="/contact-us" className="font-semibold">
                  Blog
                </Link>
              </div>
              <div className="border-t pt-4">
                <div className="mt-2 flex flex-col gap-3">
                  <ModeToggle />
                  {isAdmin && (
                    <Button variant="ghost" size="icon" className="" asChild>
                      <Link href="/admin">
                        <AdminUserIcon />
                      </Link>
                    </Button>
                  )}
                  {user ? (
                    <AvatarButton Image={user?.user_metadata.picture || user?.user_metadata.avatar_url} name={user?.user_metadata.name || user?.user_metadata.full_name} />
                  ) : (
                    <>
                      <Button variant="outline" asChild>
                        <Link href="/auth/login" className="text-muted-foreground">
                          Log in
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link href="/auth/login" className="text-foreground">
                          Sign up
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
};

export default Navbar1;

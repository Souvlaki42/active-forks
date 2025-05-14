import type { Metadata } from "next";
import { Architects_Daughter } from "next/font/google";
import { ThemeProvider } from "~/components/theme-provider";
import "./globals.css";

const architects_daughter = Architects_Daughter({
	subsets: ["latin"],
	weight: ["400"],
});

export const metadata: Metadata = {
	title: "Active Forks",
	description: "Find and analyze active forks",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={architects_daughter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}

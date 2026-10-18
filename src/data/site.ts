/**
 * Every piece of copy on the site lives here, so updating the profile never
 * means touching markup. Sourced from the current résumé (/resume).
 */

export const site = {
	url: "https://shivangswain.com",
	name: "Shivang P Swain",
	firstName: "Shivang",
	lastName: "P Swain",
	email: "me@shivangswain.com",
	role: "Senior Security Architect",
	focus: "AI Security",
	company: "Goldman Sachs",
	description:
		"Shivang P Swain is a Senior Security Architect at Goldman Sachs, specialising in AI platform security, cloud infrastructure and container ecosystems.",
	ogImage: "/assets/og.png",
	ogImageAlt:
		"'Hi, I'm Shivang P Swain' in huge uppercase letters on a near-black card, with 'P Swain' in neon lime.",
	mastodon: "https://mastodon.social/@shivangswain",
} as const;

/** Short links are Cloudflare redirects (public/_redirects), so they never go stale here. */
export const socials = [
	{ name: "GitHub", href: "/github", icon: "github", handle: "shivangswain" },
	{
		name: "LinkedIn",
		href: "/linkedin",
		icon: "linkedin",
		handle: "in/shivangswain",
	},
	{
		name: "Instagram",
		href: "/instagram",
		icon: "instagram",
		handle: "@shivangswain",
	},
	{
		name: "Bluesky",
		href: "/bluesky",
		icon: "bluesky",
		handle: "@shivangswain.com",
	},
] as const;

export const nav = [
	{ label: "About", href: "#about" },
	{ label: "Work", href: "#work" },
	{ label: "Contact", href: "#contact" },
] as const;

/** The About section's copy, one string per paragraph. */
export const about = [
	"I help engineering teams at Goldman Sachs adopt AI and cloud safely, and modernise security itself with the same tools. I lead architecture reviews, threat models and AI risk assessments, and have helped build the standards, agentic AI controls and red-team exercises behind them.",
	"Day to day, I create the controls, identify the threats, build the guardrails and secure the cloud-native platforms and applications built with and around AI, Plugins, Connectors and Agents into production under a strictly regulated environment.",
] as const;

export const facts = [
	{ value: "4+", label: "years in security engineering" },
	{ value: "SEC+", label: "CompTIA Security+ ce certified" },
	{ value: "AI", label: "platform and application security" },
	{ value: "CLOUD", label: "and container security" },
] as const;

export const ticker = [
	"AI Security",
	"Threat Modelling",
	"Agent Sandbox",
	"Data Leakage Prevention",
	"Cloud Security",
	"Risk Management",
	"Secure Architecture",
	"Prompt Injection Prevention",
	"Agent Identity & Attribution",
	"Zero Trust",
	"Cloud Guardrails",
] as const;

export const services = [
	{
		title: "AI platform security",
		body: "Risk models and secure architectures for GenAI and LLM integrations, plus firm-wide controls for agentic AI that curb privilege escalation and keep every agent action attributable.",
		tags: ["GenAI", "LLMs", "Agentic AI", "Prompt injection"],
	},
	{
		title: "Cloud & container guardrails",
		body: "Platform guardrails that make the secure path the easy one, from AWS CDK controls across ECS and EKS to GCP posture work and hardened OpenShift workloads.",
		tags: ["AWS", "GCP", "Kubernetes", "OpenShift"],
	},
	{
		title: "Threat modelling & risk",
		body: "Security reviews and governance for flagship data platforms, turning requirements into scalable engineering controls and partnering with teams to remediate risk.",
		tags: ["STRIDE", "NIST", "ISO 27001", "Governance"],
	},
] as const;

export type Role = {
	title: string;
	level?: string;
	start: string;
	end: string;
	points?: readonly string[];
};

export type Job = {
	company: string;
	logo: "gs" | "airblack" | "jpm";
	location?: string;
	roles: readonly Role[];
};

export const experience: readonly Job[] = [
	{
		company: "Goldman Sachs",
		logo: "gs",
		location: "Bengaluru · Hybrid",
		roles: [
			{
				title: "Senior AI Security Architect",
				level: "Associate",
				start: "Jan 2025",
				end: "Present",
				points: [
					"Lead AI platform security initiatives, developing risk models and secure architecture designs for GenAI and LLM integrations that directly address data leakage and prompt injection.",
					"Devise novel security controls and firm-wide standards for agentic AI use cases, curbing privilege escalation and lack of attribution during agent execution.",
					"Implement guardrails for ML pipelines with cross-functional engineering teams, automating controls to support rapid innovation while maintaining regulatory compliance.",
					"Partner with engineering teams to remediate enterprise risks and strengthen regulatory readiness.",
				],
			},
			{
				title: "GCP & Container Security Architect",
				level: "Analyst",
				start: "Jul 2022",
				end: "Dec 2024",
				points: [
					"Threat-modelled the OpenShift container platform, strengthening Kubernetes configurations and workload isolation.",
					"Built AWS CDK guardrails to standardise security across ECS and EKS environments.",
					"Led security reviews and governance for flagship data platforms built on Google BigQuery and Spanner, aligned with enterprise risk standards.",
					"Drove GCP security posture improvements through platform guardrails, service guidance and risk models for critical workloads.",
				],
			},
		],
	},
	{
		company: "Airblack",
		logo: "airblack",
		location: "Gurugram · Remote",
		roles: [
			{
				title: "Front-End Developer",
				level: "Intern",
				start: "Jan 2022",
				end: "Jun 2022",
			},
		],
	},
	{
		company: "JPMorganChase",
		logo: "jpm",
		location: "Bengaluru · Remote",
		roles: [
			{
				title: "Software Engineer",
				level: "Intern",
				start: "Jun 2020",
				end: "Jul 2020",
			},
		],
	},
];

export const skills = [
	{
		group: "AI, Platform & Application Security",
		items: [
			"AI Security",
			"LLM Risk Mitigation",
			"Threat Modelling",
			"Secure Architecture",
			"Prompt Injection Prevention",
			"Data Leakage Prevention",
			"OWASP Top 10",
			"OWASP LLM Top 10",
		],
	},
	{
		group: "Frameworks & Standards",
		items: ["NIST SP 800-53", "NIST AI RMF", "ISO 27001", "CIS Benchmarks", "STRIDE"],
	},
	{
		group: "Cloud & Platforms",
		items: [
			"Amazon Web Services",
			"Google Cloud Platform",
			"Kubernetes",
			"Red Hat OpenShift",
			"Container Security",
			"IAM",
			"Secrets Management",
		],
	},
	{
		group: "Engineering & Automation",
		items: ["Python", "REST APIs", "Git", "YAML", "Bash", "CI/CD", "Infrastructure as Code"],
	},
] as const;

export const credentials = [
	{
		kind: "Certification",
		title: "CompTIA Security+ CE",
		org: "CompTIA",
		meta: "Issued Jul 2024",
		href: "/securityplus",
		cta: "Verify on Credly",
		mark: "securityplus",
	},
	{
		kind: "Degree",
		title: "B.Tech, Information Technology",
		org: "Veer Surendra Sai University of Technology",
		meta: "2018 – 2022 · Burla, India",
		href: "/degree",
		cta: "View degree",
		mark: "vssut",
	},
] as const;

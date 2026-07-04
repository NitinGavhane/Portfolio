// One-off: extract the SVG path data for the tech icons we use from
// simple-icons into a small local file, so we don't ship the whole library.
import * as si from 'simple-icons';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const groups = [
  // Languages
  { icon: 'siJavascript', names: ['javascript', 'js', 'vanillajs'] },
  { icon: 'siTypescript', names: ['typescript', 'ts'] },
  { icon: 'siPython', names: ['python', 'py'] },
  { icon: 'siGo', names: ['go', 'golang'] },
  { icon: 'siRust', names: ['rust'] },
  { icon: 'siRuby', names: ['ruby'] },
  { icon: 'siPhp', names: ['php'] },
  { icon: 'siKotlin', names: ['kotlin'] },
  { icon: 'siSwift', names: ['swift'] },
  { icon: 'siC', names: ['c'] },
  { icon: 'siCplusplus', names: ['cpp', 'cplusplus'] },
  { icon: 'siSharp', names: ['csharp', 'cs'] },
  { icon: 'siDart', names: ['dart'] },
  { icon: 'siScala', names: ['scala'] },
  { icon: 'siElixir', names: ['elixir'] },
  { icon: 'siHtml5', names: ['html5', 'html'] },
  { icon: 'siCss3', names: ['css3', 'css'] },
  { icon: 'siSass', names: ['sass', 'scss'] },
  { icon: 'siGnubash', names: ['bash', 'shell', 'sh'] },
  { icon: 'siMarkdown', names: ['markdown', 'md'] },
  { icon: 'siMdx', names: ['mdx'] },
  { icon: 'siJson', names: ['json'] },
  { icon: 'siYaml', names: ['yaml', 'yml'] },

  // Frontend frameworks / libs
  { icon: 'siReact', names: ['react', 'reactjs', 'reactnative'] },
  { icon: 'siVuedotjs', names: ['vue', 'vuejs'] },
  { icon: 'siAngular', names: ['angular'] },
  { icon: 'siSvelte', names: ['svelte', 'sveltekit'] },
  { icon: 'siSolid', names: ['solid', 'solidjs'] },
  { icon: 'siNextdotjs', names: ['nextjs', 'next'] },
  { icon: 'siNuxtdotjs', names: ['nuxt', 'nuxtjs'] },
  { icon: 'siRemix', names: ['remix'] },
  { icon: 'siAstro', names: ['astro'] },
  { icon: 'siJquery', names: ['jquery'] },
  { icon: 'siRedux', names: ['redux'] },
  { icon: 'siTailwindcss', names: ['tailwindcss', 'tailwind'] },
  { icon: 'siBootstrap', names: ['bootstrap'] },
  { icon: 'siMui', names: ['mui', 'materialui'] },
  { icon: 'siChakraui', names: ['chakraui', 'chakra'] },
  { icon: 'siThreedotjs', names: ['threejs', 'three'] },
  { icon: 'siD3dotjs', names: ['d3', 'd3js'] },
  { icon: 'siFramer', names: ['framer', 'framermotion'] },

  // Backend / runtimes / frameworks
  { icon: 'siNodedotjs', names: ['nodejs', 'node'] },
  { icon: 'siDeno', names: ['deno'] },
  { icon: 'siBun', names: ['bun'] },
  { icon: 'siExpress', names: ['express', 'expressjs'] },
  { icon: 'siNestjs', names: ['nestjs', 'nest'] },
  { icon: 'siFastapi', names: ['fastapi'] },
  { icon: 'siFlask', names: ['flask'] },
  { icon: 'siDjango', names: ['django'] },
  { icon: 'siSpringboot', names: ['springboot', 'spring'] },
  { icon: 'siLaravel', names: ['laravel'] },
  { icon: 'siRubyonrails', names: ['rails', 'rubyonrails'] },
  { icon: 'siDotnet', names: ['dotnet', 'net'] },
  { icon: 'siGraphql', names: ['graphql'] },
  { icon: 'siApollographql', names: ['apollo', 'apollographql'] },
  { icon: 'siSocketdotio', names: ['socketio', 'socket'] },

  // Databases / data
  { icon: 'siPostgresql', names: ['postgresql', 'postgres'] },
  { icon: 'siMysql', names: ['mysql'] },
  { icon: 'siMongodb', names: ['mongodb', 'mongo'] },
  { icon: 'siRedis', names: ['redis'] },
  { icon: 'siSqlite', names: ['sqlite'] },
  { icon: 'siMariadb', names: ['mariadb'] },
  { icon: 'siPrisma', names: ['prisma'] },
  { icon: 'siSupabase', names: ['supabase'] },
  { icon: 'siFirebase', names: ['firebase'] },
  { icon: 'siElasticsearch', names: ['elasticsearch', 'elastic'] },

  // Cloud / DevOps / infra
  { icon: 'siDocker', names: ['docker'] },
  { icon: 'siKubernetes', names: ['kubernetes', 'k8s'] },
  { icon: 'siNginx', names: ['nginx'] },
  { icon: 'siVercel', names: ['vercel'] },
  { icon: 'siNetlify', names: ['netlify'] },
  { icon: 'siCloudflare', names: ['cloudflare'] },
  { icon: 'siGooglecloud', names: ['gcp', 'googlecloud'] },
  { icon: 'siDigitalocean', names: ['digitalocean'] },
  { icon: 'siHeroku', names: ['heroku'] },
  { icon: 'siLinux', names: ['linux'] },
  { icon: 'siUbuntu', names: ['ubuntu'] },
  { icon: 'siGithubactions', names: ['githubactions', 'ci', 'cicd'] },
  { icon: 'siTerraform', names: ['terraform'] },

  // Tools / testing / build
  { icon: 'siVite', names: ['vite'] },
  { icon: 'siWebpack', names: ['webpack'] },
  { icon: 'siEsbuild', names: ['esbuild'] },
  { icon: 'siBabel', names: ['babel'] },
  { icon: 'siEslint', names: ['eslint'] },
  { icon: 'siPrettier', names: ['prettier'] },
  { icon: 'siJest', names: ['jest'] },
  { icon: 'siVitest', names: ['vitest'] },
  { icon: 'siCypress', names: ['cypress'] },
  { icon: 'siPlaywright', names: ['playwright'] },
  { icon: 'siStorybook', names: ['storybook'] },
  { icon: 'siPostman', names: ['postman'] },
  { icon: 'siSwagger', names: ['swagger', 'openapi'] },

  // Version control / collab / design
  { icon: 'siGit', names: ['git'] },
  { icon: 'siGithub', names: ['github'] },
  { icon: 'siGitlab', names: ['gitlab'] },
  { icon: 'siBitbucket', names: ['bitbucket'] },
  { icon: 'siFigma', names: ['figma'] },

  // Mobile / desktop
  { icon: 'siFlutter', names: ['flutter'] },
  { icon: 'siElectron', names: ['electron'] },
  { icon: 'siExpo', names: ['expo'] },
  { icon: 'siAndroid', names: ['android'] },

  // AI / ML / data science
  { icon: 'siOpenai', names: ['openai', 'gpt', 'chatgpt'] },
  { icon: 'siAnthropic', names: ['anthropic', 'claude'] },
  { icon: 'siTensorflow', names: ['tensorflow'] },
  { icon: 'siPytorch', names: ['pytorch'] },
  { icon: 'siPandas', names: ['pandas'] },
  { icon: 'siNumpy', names: ['numpy'] },
  { icon: 'siScikitlearn', names: ['scikitlearn', 'sklearn'] },
  { icon: 'siJupyter', names: ['jupyter'] },
  { icon: 'siHuggingface', names: ['huggingface'] },
  { icon: 'siLangchain', names: ['langchain'] },
  { icon: 'siOllama', names: ['ollama'] },

  // CMS / misc web
  { icon: 'siWordpress', names: ['wordpress'] },
  { icon: 'siStripe', names: ['stripe'] },
  { icon: 'siShopify', names: ['shopify'] },
  { icon: 'siContentful', names: ['contentful'] },
  { icon: 'siSanity', names: ['sanity'] },

  // Security (from existing projects)
  { icon: 'siOwasp', names: ['owasp'] },
  { icon: 'siBurpsuite', names: ['burpsuite', 'burp'] },
  { icon: 'siWireshark', names: ['wireshark'] },
  { icon: 'siKalilinux', names: ['kali', 'kalilinux'] },
];

const out = {};
for (const g of groups) {
  const path = si[g.icon]?.path;
  if (!path) { console.error('MISSING', g.icon); continue; }
  for (const n of g.names) out[n] = path;
}

const file = `// AUTO-GENERATED by scripts/gen-tech-icons.mjs — do not edit by hand.
// SVG path data (24x24 viewBox) from simple-icons, keyed by normalized tech name.
export const TECH_ICON_PATHS: Record<string, string> = ${JSON.stringify(out, null, 2)};
`;

writeFileSync(join(root, 'src/lib/techIconPaths.ts'), file);
console.log(`Wrote ${Object.keys(out).length} icon aliases to src/lib/techIconPaths.ts`);

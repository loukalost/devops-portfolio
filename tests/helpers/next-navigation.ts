/**
 * Mock of `next/navigation`.
 *
 * `notFound()` normally throws a special framework error that App Router
 * catches to render the 404 boundary. We throw a recognizable error so tests
 * can assert that a page "would 404".
 */
export const NEXT_NOT_FOUND = "NEXT_NOT_FOUND";

export function notFound(): never {
  throw new Error(NEXT_NOT_FOUND);
}

export function redirect(url: string): never {
  throw new Error(`NEXT_REDIRECT:${url}`);
}

export const useRouter = () => ({
  push: () => {},
  replace: () => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
  prefetch: () => {},
});

export const usePathname = () => "/";
export const useSearchParams = () => new URLSearchParams();
export const useParams = () => ({});

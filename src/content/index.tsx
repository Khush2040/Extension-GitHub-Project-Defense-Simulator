import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import tailwindCss from './styles.css?inline';

export interface PageDetails {
  type: 'repo' | 'profile';
  owner: string; // Used as username for profile, owner for repo
  repo?: string;
}

// Global reference for cleanup
let reactRootInstance: ReactDOM.Root | null = null;
let rootContainer: HTMLElement | null = null;

/**
 * Extract owner and repo, or profile username from a GitHub URL.
 */
function getPageDetails(urlStr: string): PageDetails | null {
  try {
    const url = new URL(urlStr);
    if (url.hostname !== 'github.com') return null;

    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts.length === 0) return null;

    const first = pathParts[0];

    // List of reserved keywords on GitHub that are not users/repos
    const reservedNames = [
      'settings', 'orgs', 'organizations', 'site', 'explore', 
      'trending', 'features', 'topics', 'marketplace', 'collections', 
      'events', 'sponsors', 'pricing', 'about', 'contact', 
      'search', 'notifications', 'pulls', 'issues', 'security', 
      'session', 'join', 'login', 'personal-code'
    ];

    if (reservedNames.includes(first.toLowerCase())) {
      return null;
    }

    // Profile page (e.g. github.com/username)
    if (pathParts.length === 1) {
      return { type: 'profile', owner: first };
    }

    // Profile sub-tabs (e.g. github.com/username?tab=repositories or github.com/username/repositories)
    const second = pathParts[1];
    const profileTabs = ['repositories', 'projects', 'packages', 'stars', 'followers', 'following'];
    if (profileTabs.includes(second.toLowerCase())) {
      return { type: 'profile', owner: first };
    }

    // Repository page (e.g. github.com/owner/repo)
    return { type: 'repo', owner: first, repo: second };
  } catch (e) {
    console.error('Error parsing URL:', e);
  }
  return null;
}

/**
 * Unmounts the React tree and removes the DOM element.
 */
function cleanup() {
  if (reactRootInstance) {
    reactRootInstance.unmount();
    reactRootInstance = null;
  }
  if (rootContainer) {
    rootContainer.remove();
    rootContainer = null;
  }
}

/**
 * Checks the current URL and mounts the React app if it matches.
 */
function checkAndMount() {
  const pageDetails = getPageDetails(window.location.href);

  if (!pageDetails) {
    cleanup();
    return;
  }

  // If already mounted, check if it's the same type and target
  if (rootContainer) {
    const activeType = rootContainer.getAttribute('data-type');
    const activeOwner = rootContainer.getAttribute('data-owner');
    const activeRepo = rootContainer.getAttribute('data-repo') || undefined;

    if (
      activeType === pageDetails.type &&
      activeOwner === pageDetails.owner &&
      activeRepo === pageDetails.repo
    ) {
      // Same page, keep mounted
      return;
    }
    // Different page, clean up and remount
    cleanup();
  }

  // Create root container
  rootContainer = document.createElement('div');
  rootContainer.id = 'github-project-defense-simulator-root';
  rootContainer.setAttribute('data-type', pageDetails.type);
  rootContainer.setAttribute('data-owner', pageDetails.owner);
  if (pageDetails.repo) {
    rootContainer.setAttribute('data-repo', pageDetails.repo);
  }
  rootContainer.style.position = 'relative';
  rootContainer.style.zIndex = '2147483647'; // Max z-index to stay on top
  document.body.appendChild(rootContainer);

  // Attach shadow root
  const shadowRoot = rootContainer.attachShadow({ mode: 'open' });

  // Inject Tailwind CSS
  const styleElement = document.createElement('style');
  styleElement.textContent = tailwindCss;
  shadowRoot.appendChild(styleElement);

  // Create mount point for React
  const reactMountPoint = document.createElement('div');
  reactMountPoint.id = 'app-root';
  shadowRoot.appendChild(reactMountPoint);

  // Render React App
  reactRootInstance = ReactDOM.createRoot(reactMountPoint);
  reactRootInstance.render(
    <React.StrictMode>
      <App type={pageDetails.type} owner={pageDetails.owner} repo={pageDetails.repo} />
    </React.StrictMode>
  );
}

// Observe URL changes on GitHub
let lastUrl = window.location.href;
const observer = new MutationObserver(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    checkAndMount();
  }
});

observer.observe(document, { subtree: true, childList: true });

document.addEventListener('turbo:load', checkAndMount);
document.addEventListener('pjax:end', checkAndMount);

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  checkAndMount();
} else {
  window.addEventListener('DOMContentLoaded', checkAndMount);
}

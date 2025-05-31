/* Halverson Speedway Marketing Tool - Main JavaScript */

// Initialize mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Category link highlighting in sidebar
    const categoryLinks = document.querySelectorAll('.category-link');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            categoryLinks.forEach(l => {
                l.classList.remove('bg-red-600', 'text-white');
                l.classList.add('hover:bg-gray-100');
            });
            
            // Add active class to clicked link
            this.classList.add('bg-red-600', 'text-white');
            this.classList.remove('hover:bg-gray-100');
        });
    });
});

// Utility functions
const utils = {
    // Generate a random ID
    generateId: function(prefix = 'id') {
        return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
    },
    
    // Format date to readable string
    formatDate: function(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    },
    
    // Truncate text with ellipsis
    truncateText: function(text, length = 100) {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    },
    
    // Convert hex color to RGB
    hexToRgb: function(hex) {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Convert 3-digit hex to 6-digits
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        
        // Convert hex to RGB
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return { r, g, b };
    },
    
    // Convert RGB to hex
    rgbToHex: function(r, g, b) {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    
    // Get contrast color (black or white) based on background
    getContrastColor: function(hexColor) {
        const rgb = this.hexToRgb(hexColor);
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#FFFFFF';
    },
    
    // Debounce function to limit how often a function is called
    debounce: function(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
};

// Notification system
const notifications = {
    show: function(message, type = 'success', duration = 3000) {
        // Create notification element
        const notification = document.createElement('div');
        
        // Set classes based on type
        let bgColor, textColor;
        switch (type) {
            case 'success':
                bgColor = 'bg-green-600';
                textColor = 'text-white';
                break;
            case 'error':
                bgColor = 'bg-red-600';
                textColor = 'text-white';
                break;
            case 'warning':
                bgColor = 'bg-yellow-500';
                textColor = 'text-black';
                break;
            case 'info':
                bgColor = 'bg-blue-500';
                textColor = 'text-white';
                break;
            default:
                bgColor = 'bg-gray-800';
                textColor = 'text-white';
        }
        
        // Apply styles
        notification.className = `fixed bottom-4 right-4 p-4 rounded shadow-lg z-50 ${bgColor} ${textColor} transition-opacity duration-300 opacity-0`;
        notification.innerHTML = message;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Fade in
        setTimeout(() => {
            notification.classList.remove('opacity-0');
            notification.classList.add('opacity-100');
        }, 10);
        
        // Remove after duration
        setTimeout(() => {
            notification.classList.remove('opacity-100');
            notification.classList.add('opacity-0');
            
            // Remove from DOM after fade out
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, duration);
    }
};

// Local storage manager
const storageManager = {
    // Save data to localStorage
    save: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },
    
    // Load data from localStorage
    load: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    },
    
    // Remove data from localStorage
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },
    
    // Check if key exists in localStorage
    exists: function(key) {
        return localStorage.getItem(key) !== null;
    }
};

// Theme manager
const themeManager = {
    // Halvor Lines Speedway color scheme
    colors: {
        primary: '#D12026',    // Red
        secondary: '#FFDD00',  // Yellow
        dark: '#000000',       // Black
        light: '#FFFFFF',      // White
        gray: '#333333',       // Dark Gray
        lightGray: '#EEEEEE'   // Light Gray
    },
    
    // Apply theme to element
    applyTheme: function(element, theme) {
        if (!element) return;
        
        switch (theme) {
            case 'primary':
                element.style.backgroundColor = this.colors.primary;
                element.style.color = this.colors.light;
                break;
            case 'secondary':
                element.style.backgroundColor = this.colors.secondary;
                element.style.color = this.colors.dark;
                break;
            case 'dark':
                element.style.backgroundColor = this.colors.dark;
                element.style.color = this.colors.light;
                break;
            case 'light':
                element.style.backgroundColor = this.colors.light;
                element.style.color = this.colors.dark;
                break;
            default:
                // No theme applied
        }
    }
};

// Export utilities to global scope
window.utils = utils;
window.notifications = notifications;
window.storageManager = storageManager;
window.themeManager = themeManager;

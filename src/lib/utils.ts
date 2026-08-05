// ============================================
// FUNÇÕES DE DATA E HORA
// ============================================

/**
 * Formata uma data para exibição geral
 * Mantém compatibilidade com versões anteriores do projeto
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Formata uma data apenas com data (sem hora)
 */
export function formatDateOnly(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

/**
 * Formata uma data para exibição no chat
 */
export function formatChatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Agora mesmo';
  if (minutes < 60) return `${minutes} min atrás`;
  if (hours < 24) return `${hours} h atrás`;
  if (days < 7) return `${days} dias atrás`;
  
  return formatDate(date);
}

/**
 * Formata uma data relativa (ex: "há 2 dias")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'há alguns segundos';
  if (minutes < 60) return `há ${minutes} minutos`;
  if (hours < 24) return `há ${hours} horas`;
  if (days < 30) return `há ${days} dias`;
  if (months < 12) return `há ${months} meses`;
  return `há ${years} anos`;
}

// ============================================
// FUNÇÕES DE STRING E TEXTO
// ============================================

/**
 * Gera um ID único para mensagens e conversações
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Gera um ID curto (8 caracteres)
 */
export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * Obtém as iniciais de um nome
 */
export function getInitials(name: string): string {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Trunca um texto para um tamanho máximo
 */
export function truncateText(text: string, maxLength: number = 30): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Capitaliza a primeira letra de uma string
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Capitaliza a primeira letra de cada palavra
 */
export function capitalizeWords(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Remove acentos de uma string
 */
export function removeAccents(text: string): string {
  if (!text) return '';
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Converte uma string para slug (URL amigável)
 */
export function slugify(text: string): string {
  if (!text) return '';
  return removeAccents(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Verifica se uma string é vazia ou apenas espaços
 */
export function isEmptyString(text: string | null | undefined): boolean {
  return !text || text.trim().length === 0;
}

/**
 * Conta palavras em um texto
 */
export function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
}

/**
 * Extrai as primeiras N palavras de um texto
 */
export function extractWords(text: string, count: number = 10): string {
  if (!text) return '';
  const words = text.trim().split(/\s+/);
  if (words.length <= count) return text;
  return words.slice(0, count).join(' ') + '...';
}

// ============================================
// FUNÇÕES DE VALIDAÇÃO
// ============================================

/**
 * Verifica se uma string é um JSON válido
 */
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Verifica se é um email válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Verifica se é uma URL válida
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

// ============================================
// FUNÇÕES DE ÁUDIO E MÍDIA
// ============================================

/**
 * Verifica se o navegador suporta gravação de áudio
 */
export function isAudioSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

/**
 * Verifica se o navegador suporta áudio (Web Audio API)
 */
export function isWebAudioSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window.AudioContext || (window as any).webkitAudioContext);
}

/**
 * Converte Blob para base64
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Converte base64 para Blob
 */
export function base64ToBlob(base64: string, mimeType: string = 'audio/mp3'): Blob {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Cria uma URL para um Blob de áudio
 */
export function createAudioUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

/**
 * Libera uma URL de objeto criada
 */
export function revokeAudioUrl(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Converte segundos para formato MM:SS
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ============================================
// FUNÇÕES DE FORMATAÇÃO NUMÉRICA
// ============================================

/**
 * Formata um número com separadores de milhar
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Formata um número como moeda
 */
export function formatCurrency(value: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Formata um número como percentual
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// ============================================
// FUNÇÕES DE ARRAY E OBJETO
// ============================================

/**
 * Agrupa um array por uma chave
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Remove duplicatas de um array
 */
export function uniqueArray<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Ordena um array por uma chave
 */
export function sortBy<T>(array: T[], key: keyof T, ascending: boolean = true): T[] {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return ascending ? -1 : 1;
    if (a[key] > b[key]) return ascending ? 1 : -1;
    return 0;
  });
}

/**
 * Deep clone de um objeto
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Verifica se um objeto está vazio
 */
export function isEmptyObject(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

// ============================================
// FUNÇÕES DE DOM E CLIENTE
// ============================================

/**
 * Detecta se o código está rodando no cliente ou servidor
 */
export const isClient = typeof window !== 'undefined';
export const isServer = !isClient;

/**
 * Obtém a URL base da aplicação
 */
export function getBaseUrl(): string {
  if (isServer) {
    return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  }
  return window.location.origin;
}

/**
 * Obtém a URL atual com parâmetros
 */
export function getCurrentUrl(): string {
  if (!isClient) return '';
  return window.location.href;
}

/**
 * Copia texto para o clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!isClient) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
}

/**
 * Scroll suave para um elemento
 */
export function scrollToElement(elementId: string): void {
  if (!isClient) return;
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Detecta se é dispositivo móvel
 */
export function isMobile(): boolean {
  if (!isClient) return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Detecta se é modo escuro
 */
export function isDarkMode(): boolean {
  if (!isClient) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// ============================================
// FUNÇÕES DE DEBOUNCE E THROTTLE
// ============================================

/**
 * Debounce para evitar múltiplas chamadas rápidas
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle para limitar a taxa de chamadas
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

// ============================================
// FUNÇÕES DE ARQUIVO
// ============================================

/**
 * Formata o tamanho de um arquivo
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Obtém a extensão de um arquivo
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Verifica se o arquivo é uma imagem
 */
export function isImageFile(filename: string): boolean {
  const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  return extensions.includes(getFileExtension(filename));
}

/**
 * Verifica se o arquivo é um áudio
 */
export function isAudioFile(filename: string): boolean {
  const extensions = ['mp3', 'wav', 'ogg', 'webm', 'm4a', 'aac'];
  return extensions.includes(getFileExtension(filename));
}

// ============================================
// FUNÇÕES DE COR
// ============================================

/**
 * Gera uma cor aleatória em hexadecimal
 */
export function randomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

/**
 * Converte cor hexadecimal para RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

// ============================================
// UTILITY PARA TAILWIND CSS (cn)
// ============================================

/**
 * Combina classes CSS condicionalmente (utility para Tailwind)
 * Similar ao classNames ou clsx
 */
export function cn(...classes: (string | undefined | null | false | 0)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ============================================
// EXPORTAÇÃO DE TIPOS
// ============================================

export type { };
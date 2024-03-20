export function getMenu(role: string) {
  const menu = [];
  if(role === 'ADMIN') {
    menu[0] = { name: 'Admin Panel', link: 'admin' };
    menu[1] = { name: 'Liferants', link: 'liferant' };
    menu[2] = { name: 'Kategories', link: 'kategory'};
    menu[3] = { name: 'User Panel', link: 'user' };
    menu[4] = { name: 'Products', link: 'product' };
    menu[5] = { name: 'Waren Eingang', link: 'waren-eingang' };
    menu[6] = { name: 'Company', link: 'company' };
    menu[7] = { name: 'Bestellungen', link: 'admin-order'};
    menu[8] = { name: 'Refunds', link: 'refunds' };
    menu[9] = { name: 'Ebay-Verkauf/Login', link: 'ebay'};
    menu[10] = {name: 'Ebay - Subscriptions', link: 'ebay-subs'};
    menu[11] = { name: 'Ebay - Inventory', link: 'ebay-items' };
    menu[12] = { name: 'Lager', link: 'lager'};
    menu[13] = { name: 'Shipping-cost', link: 'shipping'};
    menu[14] = { name: 'Sitemap', link: 'sitemap'};
    menu[15] = { name: 'Logs', link : 'logs'};
    menu[16] = { name: 'Aktion-Rabat', link: 'aktion' };
    menu[17] = {name: 'Eigenverbrauch', link: 'own-order'}

  } else if (role === 'USER') {
    menu[0] = { name: 'User Profil', link: 'user' };
    menu[1] = { name: 'Mein Bestellungen', link: 'order' }
  }
  return menu;
}

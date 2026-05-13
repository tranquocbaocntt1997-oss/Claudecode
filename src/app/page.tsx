import Link from "next/link";
import {
  Package,
  Shield,
  Truck,
  Phone,
  ChevronRight,
  Cog,
} from "lucide-react";

const categories = [
  {
    name: "Băng Tải",
    slug: "bang-tai",
    description: "Các loại băng tải công nghiệp chất lượng cao",
    icon: "🏭",
  },
  {
    name: "Bạc Đạn",
    slug: "bac-dan",
    description: "Bạc đạn SKF, NSK, FAG và nhiều thương hiệu khác",
    icon: "⚙️",
  },
  {
    name: "Dây Curoa",
    slug: "day-curoa",
    description: "Dây curoa Gates, Mitsuboshi, Bando",
    icon: "🔧",
  },
  {
    name: "Phụ Tùng Máy",
    slug: "phu-tung-may",
    description: "Phụ tùng thay thế cho máy móc công nghiệp",
    icon: "🛠️",
  },
];

const highlights = [
  {
    icon: Shield,
    title: "Chất Lượng Đảm Bảo",
    description: "Sản phẩm chính hãng từ các thương hiệu uy tín",
  },
  {
    icon: Truck,
    title: "Giao Hàng Nhanh",
    description: "Giao hàng toàn quốc trong 24-72 giờ",
  },
  {
    icon: Phone,
    title: "Hỗ Trợ 24/7",
    description: "Tư vấn kỹ thuật miễn phí",
  },
  {
    icon: Cog,
    title: "Bảo Hành Dài Hạn",
    description: "Chế độ bảo hành lên đến 12 tháng",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1e3a5f] text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cog className="w-8 h-8 text-[#f59e0b]" />
            <div>
              <h1 className="text-xl font-bold">MD Industrial</h1>
              <p className="text-xs text-blue-200">Băng Tải - Bạc Đạn - Dây Curoa</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/products" className="hover:text-[#f59e0b] transition-colors">
              Sản phẩm
            </Link>
            <Link href="/about" className="hover:text-[#f59e0b] transition-colors">
              Giới thiệu
            </Link>
            <Link href="/contact" className="hover:text-[#f59e0b] transition-colors">
              Liên hệ
            </Link>
            <div className="flex items-center gap-3 border-l border-blue-400 pl-4">
              <Link
                href="/login"
                className="hover:text-[#f59e0b] transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="bg-[#f59e0b] text-[#1e3a5f] px-4 py-1.5 rounded-lg font-medium hover:bg-[#fbbf24] transition-colors"
              >
                Đăng ký
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Giải Pháp Công Nghiệp
            <br />
            <span className="text-[#f59e0b]">Uy Tín & Chất Lượng</span>
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
            Chuyên cung cấp các sản phẩm băng tải, bạc đạn, dây curoa và phụ
            tùng máy công nghiệp. Sản phẩm chính hãng, giá cạnh tranh, giao
            hàng nhanh chóng.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#f59e0b] text-[#1e3a5f] px-8 py-3 rounded-lg font-semibold hover:bg-[#fbbf24] transition-colors"
            >
              Xem sản phẩm
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#1e3a5f] transition-colors"
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-[#1e3a5f] mb-3">
            Danh Mục Sản Phẩm
          </h3>
          <p className="text-gray-500">
            Khám phá các sản phẩm công nghiệp đa dạng của chúng tôi
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-[#1e3a5f] transition-all group"
            >
              <div className="text-4xl mb-4">{cat.icon}</div>
              <h4 className="text-lg font-semibold text-[#1e3a5f] group-hover:text-[#f59e0b] transition-colors">
                {cat.name}
              </h4>
              <p className="text-sm text-gray-500 mt-2">{cat.description}</p>
              <div className="mt-4 text-sm text-[#1e3a5f] font-medium flex items-center gap-1 group-hover:text-[#f59e0b]">
                Xem thêm <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-14 h-14 bg-[#1e3a5f] rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-[#f59e0b]" />
                </div>
                <h4 className="font-semibold text-[#1e3a5f] mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-[#1e3a5f] mb-4">
              Về MD Industrial
            </h3>
            <p className="text-gray-600 mb-4">
              Với hơn 10 năm kinh nghiệm trong ngành công nghiệp cơ khí, MD
              Industrial tự hào là đơn vị cung cấp các sản phẩm băng tải, bạc
              đạn và dây curoa hàng đầu tại Việt Nam.
            </p>
            <p className="text-gray-600 mb-6">
              Chúng tôi cam kết mang đến sản phẩm chất lượng cao với giá cả cạnh
              tranh, cùng dịch vụ tư vấn kỹ thuật chuyên nghiệp.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-[#1e3a5f] font-medium hover:text-[#f59e0b] transition-colors"
            >
              Tìm hiểu thêm <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] rounded-2xl p-8 text-white">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#f59e0b]">10+</div>
                <div className="text-sm text-blue-200 mt-1">Năm kinh nghiệm</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#f59e0b]">500+</div>
                <div className="text-sm text-blue-200 mt-1">Khách hàng</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#f59e0b]">1000+</div>
                <div className="text-sm text-blue-200 mt-1">Sản phẩm</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#f59e0b]">63</div>
                <div className="text-sm text-blue-200 mt-1">Tỉnh thành</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1e3a5f] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-3">Bạn cần tư vấn sản phẩm?</h3>
          <p className="text-blue-200 mb-6">
            Liên hệ ngay với đội ngũ kỹ thuật của chúng tôi để được hỗ trợ
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#f59e0b] text-[#1e3a5f] px-8 py-3 rounded-lg font-semibold hover:bg-[#fbbf24] transition-colors"
          >
            <Phone className="w-5 h-5" />
            Liên hệ ngay
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Cog className="w-6 h-6 text-[#f59e0b]" />
                <span className="text-white font-bold text-lg">MD Industrial</span>
              </div>
              <p className="text-sm">
                Chuyên cung cấp băng tải, bạc đạn, dây curoa và phụ tùng máy
                công nghiệp chất lượng cao.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Liên kết nhanh</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/products" className="hover:text-[#f59e0b]">
                    Sản phẩm
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#f59e0b]">
                    Giới thiệu
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#f59e0b]">
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-sm">
                <li>📍 123 Đại lộ công nghiệp, TP.HCM</li>
                <li>📞 0909 123 456</li>
                <li>✉️ info@mdindustrial.vn</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            © 2026 MD Industrial. Tất cả quyền được bảo lưu.
          </div>
        </div>
      </footer>
    </div>
  );
}

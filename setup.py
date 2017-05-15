from setuptools import find_packages, setup

tests_requirements = [
    'pytest',
    'pytest-cov',
    'pytest-flake8',
    'pytest-isort',
]

setup(
    name="www-medsite",
    version="0.1.dev0",
    description="Website for Medsite.fr",
    url="https://www.medsite.fr",
    author="Kozea",
    packages=find_packages(),
    include_package_data=True,
    scripts=['medsite.py'],
    install_requires=[
        'Flask',
        'mandrill',
        'libsass',
    ],
    tests_require=tests_requirements,
    extras_require={'test': tests_requirements}
)
